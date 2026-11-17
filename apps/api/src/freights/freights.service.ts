import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import type { IFreightsRepository } from './repositories/freights.repository.interface.js';
import { FREIGHTS_REPOSITORY } from './repositories/freights.repository.interface.js';
import type { IApplicationsRepository } from '../applications/repositories/applications.repository.interface.js';
import { APPLICATIONS_REPOSITORY } from '../applications/repositories/applications.repository.interface.js';
import type { IReviewsRepository } from '../reviews/repositories/reviews.repository.interface.js';
import { REVIEWS_REPOSITORY } from '../reviews/repositories/reviews.repository.interface.js';
import { ApplicationStatus } from '../applications/entities/application.entity.js';
import { CreateFreightDto } from './dto/create-freight.dto.js';
import { UpdateFreightDto } from './dto/update-freight.dto.js';
import { FreightsFilterDto } from './dto/freights-filter.dto.js';
import { CarrierFreightsFilterDto } from './dto/carrier-freights-filter.dto.js';
import { AdminFreightsFilterDto } from './dto/admin-freights-filter.dto.js';
import { AdminFreightResponseDto } from './dto/admin-freight-response.dto.js';
import {
  Freight,
  FreightStatus,
  FreightDateMode,
} from './entities/freight.entity.js';
import { FreightMapper } from './mappers/freight.mapper.js';
import { abbreviateName } from '../common/utils/name.util.js';
import { FreightResponseDto } from './dto/freight-response.dto.js';
import { PaginatedResponseDto } from '../common/pagination/index.js';

const UPDATABLE_STATUSES: FreightStatus[] = [FreightStatus.OPEN];
const CANCELLABLE_STATUSES: FreightStatus[] = [
  FreightStatus.OPEN,
  FreightStatus.NEGOTIATING,
];

@Injectable()
export class FreightsService {
  constructor(
    @Inject(FREIGHTS_REPOSITORY)
    private readonly freightsRepository: IFreightsRepository,
    @Inject(APPLICATIONS_REPOSITORY)
    private readonly applicationsRepository: IApplicationsRepository,
    @Inject(REVIEWS_REPOSITORY)
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async create(
    dto: CreateFreightDto,
    clientId: string,
  ): Promise<FreightResponseDto> {
    const freight = await this.freightsRepository.create({
      clientId,
      title: dto.title,
      description: dto.description,
      vehicleCategory: dto.vehicleCategory,
      originCityId: dto.originCityId,
      originDistrict: dto.originDistrict,
      originStreet: dto.originStreet,
      originNumber: dto.originNumber,
      destinationCityId: dto.destinationCityId,
      destinationDistrict: dto.destinationDistrict,
      destinationStreet: dto.destinationStreet,
      destinationNumber: dto.destinationNumber,
      dateMode: FreightDateMode[dto.dateMode],
      exactDatetime: dto.exactDatetime ? new Date(dto.exactDatetime) : null,
      availabilityWindow: dto.availabilityWindow ?? null,
      suggestedPrice: dto.suggestedPrice ?? null,
    });

    return FreightMapper.toResponse(freight);
  }

  async findAllByClient(
    clientId: string,
    filterDto: FreightsFilterDto,
  ): Promise<PaginatedResponseDto<FreightResponseDto>> {
    const {
      page = 1,
      limit = 10,
      status,
      vehicleCategory,
      orderBy,
    } = filterDto;

    const result = await this.freightsRepository.findAllByClient(
      clientId,
      { status, vehicleCategory, orderBy },
      { page, limit },
    );

    // Verificar avaliações para fretes concluídos
    const responses = await Promise.all(
      result.data.map(async (freight) => {
        const response = FreightMapper.toResponse(freight);
        if (freight.status === FreightStatus.COMPLETED) {
          const review = await this.reviewsRepository.findByFreightAndReviewer(
            freight.id,
            clientId,
          );
          response.hasReviewed = !!review;
        }
        return response;
      }),
    );

    return PaginatedResponseDto.create({
      data: responses,
      total: result.total,
      page,
      limit,
    });
  }

  async findAllOpen(
    filterDto: CarrierFreightsFilterDto,
    carrierId: string,
  ): Promise<PaginatedResponseDto<FreightResponseDto>> {
    const {
      page = 1,
      limit = 10,
      vehicleCategory,
      orderBy,
      cityId,
      compatibleOnly,
    } = filterDto;

    let vehicleCategories = vehicleCategory ? [vehicleCategory] : undefined;

    if (compatibleOnly) {
      const compatible =
        await this.freightsRepository.findActiveVehicleCategoryNames(carrierId);
      vehicleCategories = vehicleCategories
        ? vehicleCategories.filter((category) => compatible.includes(category))
        : compatible;
    }

    if (vehicleCategories && vehicleCategories.length === 0) {
      return PaginatedResponseDto.create({
        data: [],
        total: 0,
        page,
        limit,
      });
    }

    const result = await this.freightsRepository.findAllOpen(
      { vehicleCategories, cityId, orderBy },
      { page, limit },
    );

    return PaginatedResponseDto.create({
      data: FreightMapper.toCarrierResponseList(result.data),
      total: result.total,
      page,
      limit,
    });
  }

  async findAllForAdmin(
    filterDto: AdminFreightsFilterDto,
  ): Promise<PaginatedResponseDto<AdminFreightResponseDto>> {
    const {
      page = 1,
      limit = 10,
      status,
      vehicleCategory,
      orderBy,
      search,
    } = filterDto;

    const result = await this.freightsRepository.findAllForAdmin(
      { status, vehicleCategory, orderBy, search },
      { page, limit },
    );

    return PaginatedResponseDto.create({
      data: result.data.map((row) => ({
        ...FreightMapper.toResponse(row.freight),
        clientName: row.clientName,
        applicationsCount: row.applicationsCount,
      })),
      total: result.total,
      page,
      limit,
    });
  }

  async findOneByClient(
    id: string,
    clientId: string,
  ): Promise<FreightResponseDto> {
    const freight = await this.freightsRepository.findByIdAndClient(
      id,
      clientId,
    );

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${id} não encontrado`);
    }

    const response = FreightMapper.toResponse(freight);

    // Verificar se o cliente já avaliou este frete
    if (freight.status === FreightStatus.COMPLETED) {
      const review = await this.reviewsRepository.findByFreightAndReviewer(
        id,
        clientId,
      );
      response.hasReviewed = !!review;
    }

    return response;
  }

  async findOneOpen(id: string): Promise<FreightResponseDto> {
    const freight = await this.freightsRepository.findOpenById(id);

    if (!freight) {
      throw new NotFoundException(
        `Frete com ID ${id} não encontrado ou não está disponível`,
      );
    }

    return FreightMapper.toResponse(freight);
  }

  async findOneForCarrier(
    id: string,
    freighterId: string,
  ): Promise<FreightResponseDto> {
    const openFreight = await this.freightsRepository.findOpenById(id);
    if (openFreight) {
      return this.withClientSummary(
        FreightMapper.toCarrierResponse(openFreight),
        openFreight.clientId,
      );
    }

    const freight = await this.freightsRepository.findById(id);
    if (!freight) {
      throw new NotFoundException(`Frete com ID ${id} não encontrado`);
    }

    const application =
      await this.applicationsRepository.findByFreightAndFreighter(
        id,
        freighterId,
      );
    if (
      !application ||
      (application.status !== ApplicationStatus.PENDING &&
        application.status !== ApplicationStatus.ACCEPTED &&
        application.status !== ApplicationStatus.COMPLETED)
    ) {
      throw new NotFoundException(`Frete com ID ${id} não está disponível`);
    }

    const revealFullAddress =
      application.status === ApplicationStatus.ACCEPTED ||
      application.status === ApplicationStatus.COMPLETED;

    return this.withClientSummary(
      FreightMapper.toCarrierResponse(freight, revealFullAddress),
      freight.clientId,
      revealFullAddress,
    );
  }

  private async withClientSummary(
    response: FreightResponseDto,
    clientId: string,
    revealContact = false,
  ): Promise<FreightResponseDto> {
    const summary = await this.freightsRepository.getClientSummary(clientId);
    if (summary) {
      // Nome completo e telefone só depois que a proposta do fretista é aceita (RN03)
      response.client = {
        name: revealContact ? summary.name : abbreviateName(summary.name),
        averageRating: Math.round(summary.averageRating * 10) / 10,
        totalReviews: summary.totalReviews,
        completedFreights: summary.completedFreights,
        ...(revealContact ? { phoneNumber: summary.phoneNumber } : {}),
      };
    }
    return response;
  }

  async update(
    id: string,
    clientId: string,
    dto: UpdateFreightDto,
  ): Promise<FreightResponseDto> {
    const freight = await this.getOwnedFreight(id, clientId);

    if (!UPDATABLE_STATUSES.includes(freight.status)) {
      throw new ForbiddenException(
        `Fretes com status "${freight.status}" não podem ser editados`,
      );
    }

    const updated = await this.freightsRepository.update(id, {
      title: dto.title,
      description: dto.description,
      vehicleCategory: dto.vehicleCategory,
      originCityId: dto.originCityId,
      originDistrict: dto.originDistrict,
      originStreet: dto.originStreet,
      originNumber: dto.originNumber,
      destinationCityId: dto.destinationCityId,
      destinationDistrict: dto.destinationDistrict,
      destinationStreet: dto.destinationStreet,
      destinationNumber: dto.destinationNumber,
      dateMode: dto.dateMode ? FreightDateMode[dto.dateMode] : undefined,
      exactDatetime: dto.exactDatetime
        ? new Date(dto.exactDatetime)
        : undefined,
      availabilityWindow: dto.availabilityWindow,
      suggestedPrice: dto.suggestedPrice,
    });

    return FreightMapper.toResponse(updated);
  }

  async cancel(id: string, clientId: string): Promise<FreightResponseDto> {
    const freight = await this.getOwnedFreight(id, clientId);

    if (!CANCELLABLE_STATUSES.includes(freight.status)) {
      throw new ForbiddenException(
        `Fretes com status "${freight.status}" não podem ser cancelados`,
      );
    }

    const cancelled =
      await this.freightsRepository.cancelWithPendingApplications(id);

    if (!cancelled) {
      throw new ConflictException(
        'O frete mudou de status e não pode mais ser cancelado',
      );
    }

    return FreightMapper.toResponse(cancelled);
  }

  private async getOwnedFreight(
    id: string,
    clientId: string,
  ): Promise<Freight> {
    const freight = await this.freightsRepository.findByIdAndClient(
      id,
      clientId,
    );

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${id} não encontrado`);
    }

    return freight;
  }
}
