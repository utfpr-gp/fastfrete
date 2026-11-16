import { Injectable, Inject } from '@nestjs/common';
import {
  ICarriersRepository,
  CARRIERS_REPOSITORY,
} from './repositories/carriers.repository.interface.js';
import { CarriersFilterDto } from './dto/carriers-filter.dto.js';
import { CarrierResponseDto } from './dto/carrier-response.dto.js';
import { CarrierMapper } from './mappers/carrier.mapper.js';
import { PaginatedResponseDto } from '../common/pagination/index.js';

@Injectable()
export class CarriersService {
  constructor(
    @Inject(CARRIERS_REPOSITORY)
    private readonly carriersRepository: ICarriersRepository,
  ) {}

  async findAll(
    filterDto: CarriersFilterDto,
  ): Promise<PaginatedResponseDto<CarrierResponseDto>> {
    const { page = 1, limit = 10, vehicleCategory } = filterDto;

    const result = await this.carriersRepository.findCarriersWithVehicles(
      { vehicleCategory },
      { page, limit },
    );

    const responseData = CarrierMapper.toResponseList(result.data);

    return PaginatedResponseDto.create({
      data: responseData,
      total: result.total,
      page,
      limit,
    });
  }
}
