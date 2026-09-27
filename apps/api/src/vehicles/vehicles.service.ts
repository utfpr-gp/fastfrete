import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { IVehiclesRepository } from './repositories/vehicles.repository.interface.js';
import { VEHICLES_REPOSITORY } from './repositories/vehicles.repository.interface.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { VehiclesFilterDto } from './dto/vehicles-filter.dto.js';
import { Vehicle } from './entities/vehicle.entity.js';
import { VehicleMapper } from './mappers/vehicle.mapper.js';
import { VehicleResponseDto } from './dto/vehicle-response.dto.js';
import { PaginatedResponseDto } from '../common/pagination/index.js';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(VEHICLES_REPOSITORY)
    private readonly vehiclesRepository: IVehiclesRepository,
  ) {}

  async create(dto: CreateVehicleDto, userId: string): Promise<VehicleResponseDto> {
    const vehicle = await this.vehiclesRepository.create({
      userId,
      vehicleCategoryId: dto.vehicleCategoryId,
      model: dto.model,
      plate: dto.plate ?? null,
      capacityKg: dto.capacityKg.toString(),
      color: dto.color ?? null,
    });

    return VehicleMapper.toResponse(vehicle);
  }

  async findAllByUser(
    userId: string,
    filterDto: VehiclesFilterDto,
  ): Promise<PaginatedResponseDto<VehicleResponseDto>> {
    const { page = 1, limit = 10, vehicleCategoryId, active } = filterDto;

    const result = await this.vehiclesRepository.findAllByUser(
      userId,
      { vehicleCategoryId, active },
      { page, limit },
    );

    return PaginatedResponseDto.create({
      data: VehicleMapper.toResponseList(result.data),
      total: result.total,
      page,
      limit,
    });
  }

  async findOneByUser(id: string, userId: string): Promise<VehicleResponseDto> {
    const vehicle = await this.vehiclesRepository.findByIdAndUser(id, userId);

    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }

    return VehicleMapper.toResponse(vehicle);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.getOwnedVehicle(id, userId);

    const updated = await this.vehiclesRepository.update(id, {
      vehicleCategoryId: dto.vehicleCategoryId,
      model: dto.model,
      plate: dto.plate,
      capacityKg: dto.capacityKg?.toString(),
      color: dto.color,
      active: dto.active,
    });

    return VehicleMapper.toResponse(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.getOwnedVehicle(id, userId);

    await this.vehiclesRepository.delete(id);
  }

  async findAllByFreighter(
    freighterId: string,
    filterDto: VehiclesFilterDto,
  ): Promise<PaginatedResponseDto<VehicleResponseDto>> {
    const { page = 1, limit = 10 } = filterDto;

    const result = await this.vehiclesRepository.findByFreighter(
      freighterId,
      { page, limit },
    );

    return PaginatedResponseDto.create({
      data: VehicleMapper.toResponseList(result.data),
      total: result.total,
      page,
      limit,
    });
  }

  private async getOwnedVehicle(
    id: string,
    userId: string,
  ): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findByIdAndUser(id, userId);

    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }

    return vehicle;
  }
}
