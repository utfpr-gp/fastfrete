import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import type { IApplicationsRepository } from './repositories/applications.repository.interface.js';
import { APPLICATIONS_REPOSITORY } from './repositories/applications.repository.interface.js';
import type { IFreightsRepository } from '../freights/repositories/freights.repository.interface.js';
import { FREIGHTS_REPOSITORY } from '../freights/repositories/freights.repository.interface.js';
import { ApplicationMapper } from './mappers/application.mapper.js';
import {
  Application,
  ApplicationStatus,
} from './entities/application.entity.js';
import { FreightStatus } from '../freights/entities/freight.entity.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';
import { ApplicationsFilterDto } from './dto/applications-filter.dto.js';
import { ApplicationResponseDto } from './dto/application-response.dto.js';
import { PaginatedResponseDto } from '../common/pagination/index.js';

const EDITABLE_STATUSES: ApplicationStatus[] = [ApplicationStatus.PENDING];
const WITHDRAWABLE_STATUSES: ApplicationStatus[] = [ApplicationStatus.PENDING];
const ACCEPTABLE_STATUSES: ApplicationStatus[] = [ApplicationStatus.PENDING];
const REJECTABLE_STATUSES: ApplicationStatus[] = [ApplicationStatus.PENDING];
const COMPLETABLE_STATUSES: ApplicationStatus[] = [ApplicationStatus.ACCEPTED];

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(APPLICATIONS_REPOSITORY)
    private readonly applicationsRepository: IApplicationsRepository,
    @Inject(FREIGHTS_REPOSITORY)
    private readonly freightsRepository: IFreightsRepository,
  ) {}

  async create(
    freightId: string,
    freighterId: string,
    dto: CreateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    const freight = await this.freightsRepository.findById(freightId);

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${freightId} não encontrado`);
    }

    if (freight.status !== FreightStatus.OPEN) {
      throw new ForbiddenException(
        `Fretes com status "${freight.status}" não aceitam propostas`,
      );
    }

    const existing =
      await this.applicationsRepository.findByFreightAndFreighter(
        freightId,
        freighterId,
      );

    if (existing) {
      throw new ConflictException(
        'Você já enviou uma proposta para este frete',
      );
    }

    const vehicleValid =
      await this.applicationsRepository.validateVehicleOwnership(
        dto.vehicleId,
        freighterId,
      );

    if (!vehicleValid) {
      throw new ForbiddenException(
        'Veículo não encontrado ou não pertence ao fretista',
      );
    }

    const application = await this.applicationsRepository.create({
      freightId,
      freighterId,
      vehicleId: dto.vehicleId,
      proposedPrice: dto.proposedValue.toString(),
    });

    return ApplicationMapper.toResponse(application);
  }

  async findAllByFreight(
    freightId: string,
    clientId: string,
  ): Promise<ApplicationResponseDto[]> {
    const freight = await this.freightsRepository.findByIdAndClient(
      freightId,
      clientId,
    );

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${freightId} não encontrado`);
    }

    const applications =
      await this.applicationsRepository.findByFreight(freightId);

    return ApplicationMapper.toResponseList(applications);
  }

  async findOne(id: string, userId: string): Promise<ApplicationResponseDto> {
    const application = await this.applicationsRepository.findById(id);

    if (!application) {
      throw new NotFoundException(`Proposta com ID ${id} não encontrada`);
    }

    if (application.freighterId !== userId) {
      const freight = await this.freightsRepository.findById(
        application.freightId,
      );

      if (!freight || freight.clientId !== userId) {
        throw new ForbiddenException('Acesso negado a esta proposta');
      }
    }

    return ApplicationMapper.toResponse(application);
  }

  async findAllByFreighter(
    freighterId: string,
    filterDto: ApplicationsFilterDto,
  ): Promise<PaginatedResponseDto<ApplicationResponseDto>> {
    const { page = 1, limit = 10, status, freightId } = filterDto;

    const result = await this.applicationsRepository.findByFreighter(
      freighterId,
      { status, freightId },
      { page, limit },
    );

    return PaginatedResponseDto.create({
      data: ApplicationMapper.toResponseList(result.data),
      total: result.total,
      page,
      limit,
    });
  }

  async update(
    id: string,
    freighterId: string,
    dto: UpdateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    const application = await this.getOwnedApplication(id, freighterId);

    if (!EDITABLE_STATUSES.includes(application.status)) {
      throw new ForbiddenException(
        `Propostas com status "${application.status}" não podem ser editadas`,
      );
    }

    const updated = await this.applicationsRepository.update(id, {
      proposedPrice: dto.proposedValue.toString(),
    });

    return ApplicationMapper.toResponse(updated);
  }

  async withdraw(
    id: string,
    freighterId: string,
  ): Promise<ApplicationResponseDto> {
    const application = await this.getOwnedApplication(id, freighterId);

    if (!WITHDRAWABLE_STATUSES.includes(application.status)) {
      throw new ForbiddenException(
        `Propostas com status "${application.status}" não podem ser canceladas`,
      );
    }

    const withdrawn = await this.applicationsRepository.updateStatus(
      id,
      ApplicationStatus.WITHDRAWN,
    );

    return ApplicationMapper.toResponse(withdrawn);
  }

  async accept(id: string, clientId: string): Promise<ApplicationResponseDto> {
    const application = await this.applicationsRepository.findById(id);

    if (!application) {
      throw new NotFoundException(`Proposta com ID ${id} não encontrada`);
    }

    const freight = await this.freightsRepository.findByIdAndClient(
      application.freightId,
      clientId,
    );

    if (!freight) {
      throw new NotFoundException(`Frete não encontrado`);
    }

    if (!ACCEPTABLE_STATUSES.includes(application.status)) {
      throw new ForbiddenException(
        `Propostas com status "${application.status}" não podem ser aceitas`,
      );
    }

    const accepted = await this.applicationsRepository.acceptApplication(id);

    return ApplicationMapper.toResponse(accepted);
  }

  async reject(id: string, clientId: string): Promise<ApplicationResponseDto> {
    const application = await this.applicationsRepository.findById(id);

    if (!application) {
      throw new NotFoundException(`Proposta com ID ${id} não encontrada`);
    }

    const freight = await this.freightsRepository.findByIdAndClient(
      application.freightId,
      clientId,
    );

    if (!freight) {
      throw new NotFoundException(`Frete não encontrado`);
    }

    if (!REJECTABLE_STATUSES.includes(application.status)) {
      throw new ForbiddenException(
        `Propostas com status "${application.status}" não podem ser rejeitadas`,
      );
    }

    const rejected = await this.applicationsRepository.updateStatus(
      id,
      ApplicationStatus.REJECTED,
    );

    return ApplicationMapper.toResponse(rejected);
  }

  async complete(id: string, userId: string): Promise<ApplicationResponseDto> {
    const application = await this.applicationsRepository.findById(id);

    if (!application) {
      throw new NotFoundException(`Proposta com ID ${id} não encontrada`);
    }

    const freight = await this.freightsRepository.findById(
      application.freightId,
    );

    if (!freight) {
      throw new NotFoundException(`Frete não encontrado`);
    }

    if (application.freighterId !== userId && freight.clientId !== userId) {
      throw new ForbiddenException('Acesso negado a esta proposta');
    }

    if (!COMPLETABLE_STATUSES.includes(application.status)) {
      throw new ForbiddenException(
        `Propostas com status "${application.status}" não podem ser finalizadas`,
      );
    }

    const completed = await this.applicationsRepository.completeApplication(id);

    return ApplicationMapper.toResponse(completed);
  }

  private async getOwnedApplication(
    id: string,
    freighterId: string,
  ): Promise<Application> {
    const application = await this.applicationsRepository.findById(id);

    if (!application) {
      throw new NotFoundException(`Proposta com ID ${id} não encontrada`);
    }

    if (application.freighterId !== freighterId) {
      throw new ForbiddenException('Acesso negado a esta proposta');
    }

    return application;
  }
}
