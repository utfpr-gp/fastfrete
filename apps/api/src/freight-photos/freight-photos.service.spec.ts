import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { FreightPhotosService } from './freight-photos.service';
import {
  FREIGHT_PHOTOS_REPOSITORY,
  IFreightPhotosRepository,
} from './repositories/freight-photos.repository.interface';
import {
  FREIGHTS_REPOSITORY,
  IFreightsRepository,
} from '../freights/repositories/freights.repository.interface';
import { APPLICATIONS_REPOSITORY } from '../applications/repositories/applications.repository.interface';
import { FreightPhoto } from './entities/freight-photo.entity';
import {
  Freight,
  FreightStatus,
  FreightDateMode,
} from '../freights/entities/freight.entity';

const mockPhoto = (overrides: Partial<FreightPhoto> = {}): FreightPhoto =>
  new FreightPhoto({
    id: 'photo-1',
    freightId: 'freight-1',
    url: '/uploads/freight-photos/test.jpg',
    order: 1,
    createdAt: new Date('2026-01-01'),
    ...overrides,
  });

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
    originCity: { id: 'city-1', name: 'Curitiba', state: 'PR' },
    destinationCity: { id: 'city-2', name: 'Londrina', state: 'PR' },
    coverPhoto: null,
    ...overrides,
  });

const mockFile = (): Express.Multer.File =>
  ({
    buffer: Buffer.from('test'),
    originalname: 'test.jpg',
  }) as Express.Multer.File;

describe('FreightPhotosService', () => {
  let service: FreightPhotosService;
  let photosRepo: jest.Mocked<IFreightPhotosRepository>;
  let freightsRepo: jest.Mocked<IFreightsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreightPhotosService,
        {
          provide: FREIGHT_PHOTOS_REPOSITORY,
          useValue: {
            create: jest.fn(),
            createWithLimitCheck: jest.fn(),
            findById: jest.fn(),
            findByFreight: jest.fn(),
            countByFreight: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: FREIGHTS_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: APPLICATIONS_REPOSITORY,
          useValue: {
            findByFreight: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<FreightPhotosService>(FreightPhotosService);
    photosRepo = module.get(FREIGHT_PHOTOS_REPOSITORY);
    freightsRepo = module.get(FREIGHTS_REPOSITORY);
  });

  describe('upload', () => {
    it('deve fazer upload de foto quando usuário é o dono do frete', async () => {
      const freight = mockFreight();
      const photo = mockPhoto();

      freightsRepo.findById.mockResolvedValue(freight);
      photosRepo.countByFreight.mockResolvedValue(0);
      photosRepo.createWithLimitCheck.mockResolvedValue(photo);

      const result = await service.upload('freight-1', 'client-1', mockFile());

      expect(result).toBeDefined();
      expect(result.url).toContain('/uploads/freight-photos/');
      expect(photosRepo.createWithLimitCheck).toHaveBeenCalledWith(
        'freight-1',
        expect.stringContaining('/uploads/freight-photos/'),
        3,
      );
    });

    it('deve lançar NotFoundException quando frete não existe', async () => {
      freightsRepo.findById.mockResolvedValue(null);

      await expect(
        service.upload('freight-1', 'client-1', mockFile()),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException quando usuário não é o dono do frete', async () => {
      const freight = mockFreight();
      freightsRepo.findById.mockResolvedValue(freight);

      await expect(
        service.upload('freight-1', 'client-999', mockFile()),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar BadRequestException quando limite de fotos foi atingido', async () => {
      const freight = mockFreight();
      freightsRepo.findById.mockResolvedValue(freight);
      photosRepo.countByFreight.mockResolvedValue(3);

      await expect(
        service.upload('freight-1', 'client-1', mockFile()),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException quando formato de arquivo não é permitido', async () => {
      const freight = mockFreight();
      const invalidFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.pdf',
      } as Express.Multer.File;

      freightsRepo.findById.mockResolvedValue(freight);
      photosRepo.countByFreight.mockResolvedValue(0);

      await expect(
        service.upload('freight-1', 'client-1', invalidFile),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByFreight', () => {
    it('deve retornar lista de fotos do frete', async () => {
      const freight = mockFreight();
      const photos = [mockPhoto()];

      freightsRepo.findById.mockResolvedValue(freight);
      photosRepo.findByFreight.mockResolvedValue(photos);

      const result = await service.findByFreight('freight-1', {
        id: 'client-1',
        roleTypes: ['CUSTOMER'],
      } as any);

      expect(result).toHaveLength(1);
    });

    it('deve lançar NotFoundException quando frete não existe', async () => {
      freightsRepo.findById.mockResolvedValue(null);

      await expect(
        service.findByFreight('freight-1', {
          id: 'client-1',
          roleTypes: ['CUSTOMER'],
        } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deve deletar foto quando usuário é o dono do frete', async () => {
      const freight = mockFreight();
      const photo = mockPhoto();

      freightsRepo.findById.mockResolvedValue(freight);
      photosRepo.findById.mockResolvedValue(photo);
      photosRepo.delete.mockResolvedValue(undefined);

      await service.delete('freight-1', 'photo-1', 'client-1');

      expect(photosRepo.delete).toHaveBeenCalledWith('photo-1');
    });

    it('deve lançar ForbiddenException quando usuário não é o dono do frete', async () => {
      const freight = mockFreight();
      freightsRepo.findById.mockResolvedValue(freight);

      await expect(
        service.delete('freight-1', 'photo-1', 'client-999'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar NotFoundException quando foto não existe no frete', async () => {
      const freight = mockFreight();
      freightsRepo.findById.mockResolvedValue(freight);
      photosRepo.findById.mockResolvedValue(null);

      await expect(
        service.delete('freight-1', 'photo-1', 'client-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
