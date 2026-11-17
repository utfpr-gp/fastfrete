import { Test, TestingModule } from '@nestjs/testing';
import { FreightsService } from './freights.service';
import { FREIGHTS_REPOSITORY } from './repositories/freights.repository.interface';
import { APPLICATIONS_REPOSITORY } from '../applications/repositories/applications.repository.interface';
import { REVIEWS_REPOSITORY } from '../reviews/repositories/reviews.repository.interface';
import {
  Freight,
  FreightDateMode,
  FreightStatus,
} from './entities/freight.entity';
import { CreateFreightDto } from './dto/create-freight.dto';

const mockFreight = (overrides: Partial<Freight> = {}): Freight =>
  new Freight({
    id: 'freight-1',
    clientId: 'client-1',
    title: 'Frete teste',
    description: 'Descrição',
    vehicleCategory: 'Van',
    originCityId: 'city-1',
    originDistrict: 'Centro',
    originStreet: 'Rua A',
    originNumber: '1',
    destinationCityId: 'city-2',
    destinationDistrict: 'Bairro',
    destinationStreet: 'Rua B',
    destinationNumber: '2',
    dateMode: FreightDateMode.IMMEDIATE,
    exactDatetime: null,
    availabilityWindow: null,
    suggestedPrice: null,
    status: FreightStatus.OPEN,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    selectedApplicationId: null,
    originCity: { id: 'city-1', name: 'Guarapuava', state: 'PR' },
    destinationCity: { id: 'city-1', name: 'Guarapuava', state: 'PR' },
    coverPhoto: null,
    ...overrides,
  });

describe('FreightsService', () => {
  let service: FreightsService;
  let freightsRepo: {
    findAllOpen: jest.Mock;
    findActiveVehicleCategoryNames: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    findByIdAndClient: jest.Mock;
  };

  beforeEach(async () => {
    freightsRepo = {
      findAllOpen: jest.fn().mockResolvedValue({ data: [], total: 0 }),
      findActiveVehicleCategoryNames: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findByIdAndClient: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreightsService,
        { provide: FREIGHTS_REPOSITORY, useValue: freightsRepo },
        { provide: APPLICATIONS_REPOSITORY, useValue: {} },
        { provide: REVIEWS_REPOSITORY, useValue: {} },
      ],
    }).compile();

    service = module.get(FreightsService);
  });

  describe('findAllOpen', () => {
    it('does not restrict categories when compatibleOnly is not set', async () => {
      await service.findAllOpen({}, 'carrier-1');

      expect(freightsRepo.findActiveVehicleCategoryNames).not.toHaveBeenCalled();
      expect(freightsRepo.findAllOpen).toHaveBeenCalledWith(
        { vehicleCategories: undefined, cityId: undefined, orderBy: undefined },
        { page: 1, limit: 10 },
      );
    });

    it('restricts to the categories of the active vehicles of the carrier', async () => {
      freightsRepo.findActiveVehicleCategoryNames.mockResolvedValue([
        'Van',
        'Moto',
      ]);

      await service.findAllOpen({ compatibleOnly: true }, 'carrier-1');

      expect(freightsRepo.findActiveVehicleCategoryNames).toHaveBeenCalledWith(
        'carrier-1',
      );
      expect(freightsRepo.findAllOpen).toHaveBeenCalledWith(
        expect.objectContaining({ vehicleCategories: ['Van', 'Moto'] }),
        expect.anything(),
      );
    });

    it('intersects the selected category with the compatible ones', async () => {
      freightsRepo.findActiveVehicleCategoryNames.mockResolvedValue([
        'Van',
        'Moto',
      ]);

      await service.findAllOpen(
        { compatibleOnly: true, vehicleCategory: 'Moto' },
        'carrier-1',
      );

      expect(freightsRepo.findAllOpen).toHaveBeenCalledWith(
        expect.objectContaining({ vehicleCategories: ['Moto'] }),
        expect.anything(),
      );
    });

    it('returns an empty page when the selected category is not compatible', async () => {
      freightsRepo.findActiveVehicleCategoryNames.mockResolvedValue(['Van']);

      const result = await service.findAllOpen(
        { compatibleOnly: true, vehicleCategory: 'Caminhão Truck' },
        'carrier-1',
      );

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(freightsRepo.findAllOpen).not.toHaveBeenCalled();
    });

    it('returns an empty page when the carrier has no active vehicles', async () => {
      freightsRepo.findActiveVehicleCategoryNames.mockResolvedValue([]);

      const result = await service.findAllOpen(
        { compatibleOnly: true },
        'carrier-1',
      );

      expect(result.data).toEqual([]);
      expect(freightsRepo.findAllOpen).not.toHaveBeenCalled();
    });

    it('forwards the city filter and the single category', async () => {
      await service.findAllOpen(
        { cityId: 'city-1', vehicleCategory: 'Van' },
        'carrier-1',
      );

      expect(freightsRepo.findAllOpen).toHaveBeenCalledWith(
        expect.objectContaining({
          cityId: 'city-1',
          vehicleCategories: ['Van'],
        }),
        expect.anything(),
      );
    });

    it('exposes the suggested price in the response', async () => {
      freightsRepo.findAllOpen.mockResolvedValue({
        data: [mockFreight({ suggestedPrice: 350 })],
        total: 1,
      });

      const result = await service.findAllOpen({}, 'carrier-1');

      expect(result.data[0].suggestedPrice).toBe(350);
    });
  });

  describe('create', () => {
    const dto = (overrides: Partial<CreateFreightDto> = {}): CreateFreightDto =>
      ({
        title: 'Mudança',
        description: 'Descrição do frete',
        vehicleCategory: 'Van',
        originCityId: 'city-1',
        originDistrict: 'Centro',
        originStreet: 'Rua A',
        originNumber: '1',
        destinationCityId: 'city-1',
        destinationDistrict: 'Batel',
        destinationStreet: 'Rua B',
        destinationNumber: '2',
        dateMode: FreightDateMode.IMMEDIATE,
        ...overrides,
      }) as CreateFreightDto;

    it('stores the suggested price when informed', async () => {
      freightsRepo.create.mockResolvedValue(
        mockFreight({ suggestedPrice: 350 }),
      );

      const result = await service.create(dto({ suggestedPrice: 350 }), 'c1');

      expect(freightsRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ suggestedPrice: 350 }),
      );
      expect(result.suggestedPrice).toBe(350);
    });

    it('stores null when the suggested price is omitted', async () => {
      freightsRepo.create.mockResolvedValue(mockFreight());

      await service.create(dto(), 'c1');

      expect(freightsRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ suggestedPrice: null }),
      );
    });
  });

  describe('update', () => {
    it('clears the suggested price when null is sent', async () => {
      freightsRepo.findByIdAndClient.mockResolvedValue(mockFreight());
      freightsRepo.update.mockResolvedValue(mockFreight());

      await service.update('freight-1', 'client-1', { suggestedPrice: null });

      expect(freightsRepo.update).toHaveBeenCalledWith(
        'freight-1',
        expect.objectContaining({ suggestedPrice: null }),
      );
    });

    it('keeps the suggested price when the field is not sent', async () => {
      freightsRepo.findByIdAndClient.mockResolvedValue(mockFreight());
      freightsRepo.update.mockResolvedValue(mockFreight());

      await service.update('freight-1', 'client-1', { title: 'Novo título' });

      expect(freightsRepo.update).toHaveBeenCalledWith(
        'freight-1',
        expect.objectContaining({ suggestedPrice: undefined }),
      );
    });
  });
});
