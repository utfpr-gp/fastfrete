import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CitiesService } from '../cities.service.js';
import { CityResponseDto } from '../dto/city-response.dto.js';

@ApiTags('Cities')
@ApiBearerAuth('JWT-auth')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de cidades atendidas pela plataforma',
    type: [CityResponseDto],
  })
  async findAll(): Promise<CityResponseDto[]> {
    return this.citiesService.findAll();
  }
}
