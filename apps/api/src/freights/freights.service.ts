import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { IFreightsRepository } from './repositories/freights.repository.interface.js';
import { FREIGHTS_REPOSITORY } from './repositories/freights.repository.interface.js';
import { CreateFreightDto } from './dto/create-freight.dto.js';
import { UpdateFreightDto } from './dto/update-freight.dto.js';
import { FreightsFilterDto } from './dto/freights-filter.dto.js';
import { Freight, FreightStatus, FreightDateMode } from './entities/freight.entity.js';
import { FreightMapper } from './mappers/freight.mapper.js';
import { FreightResponseDto } from './dto/freight-response.dto.js';
import { PaginatedResponseDto } from '../common/pagination/index.js';

const UPDATABLE_STATUSES: FreightStatus[] = [FreightStatus.OPEN];
const CANCELLABLE_STATUSES: FreightStatus[] = [FreightStatus.OPEN, FreightStatus.NEGOTIATING];

@Injectable()
export class FreightsService {
  constructor(
    @Inject(FREIGHTS_REPOSITORY)
    private readonly freightsRepository: IFreightsRepository,
  ) {}

  async create(dto: CreateFreightDto, clientId: string): Promise<FreightResponseDto> {
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
    });

    return FreightMapper.toResponse(freight);
  }

  async findAllByClient(
    clientId: string,
    filterDto: FreightsFilterDto,
  ): Promise<PaginatedResponseDto<FreightResponseDto>> {
    const { page = 1, limit = 10, status, vehicleCategory } = filterDto;

    const result = await this.freightsRepository.findAllByClient(
      clientId,
      { status, vehicleCategory },
      { page, limit },
    );

    return PaginatedResponseDto.create({
      data: FreightMapper.toResponseList(result.data),
      total: result.total,
      page,
      limit,
    });
  }

  async findOneByClient(id: string, clientId: string): Promise<FreightResponseDto> {
    const freight = await this.freightsRepository.findByIdAndClient(id, clientId);

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${id} não encontrado`);
    }

    return FreightMapper.toResponse(freight);
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
      exactDatetime: dto.exactDatetime ? new Date(dto.exactDatetime) : undefined,
      availabilityWindow: dto.availabilityWindow,
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

    const cancelled = await this.freightsRepository.updateStatus(
      id,
      FreightStatus.CANCELLED,
    );

    return FreightMapper.toResponse(cancelled);
  }

  private async getOwnedFreight(id: string, clientId: string): Promise<Freight> {
    const freight = await this.freightsRepository.findByIdAndClient(id, clientId);

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${id} não encontrado`);
    }

    return freight;
  }
}
