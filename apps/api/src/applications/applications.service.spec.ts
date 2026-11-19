import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  APPLICATIONS_REPOSITORY,
  IApplicationsRepository,
} from './repositories/applications.repository.interface';
import {
  FREIGHTS_REPOSITORY,
  IFreightsRepository,
} from '../freights/repositories/freights.repository.interface';
import { REVIEWS_REPOSITORY } from '../reviews/repositories/reviews.repository.interface';
import { Application, ApplicationStatus } from './entities/application.entity';
import {
  Freight,
  FreightStatus,
  FreightDateMode,
} from '../freights/entities/freight.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

const mockApplication = (overrides: Partial<Application> = {}): Application =>
  new Application({
    id: 'app-1',
    freightId: 'freight-1',
    freighterId: 'carrier-1',
    vehicleId: 'vehicle-1',
    vehicle: null,
    proposedPrice: '500.00',
    status: ApplicationStatus.PENDING,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
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

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let applicationsRepo: jest.Mocked<IApplicationsRepository>;
  let freightsRepo: jest.Mocked<IFreightsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: APPLICATIONS_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByFreight: jest.fn(),
            findByFreightAndFreighter: jest.fn(),
            findByFreighter: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
            acceptApplication: jest.fn(),
            completeApplication: jest.fn(),
            validateVehicleOwnership: jest.fn(),
          },
        },
        {
          provide: FREIGHTS_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAllByClient: jest.fn(),
            findById: jest.fn(),
            findByIdAndClient: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: REVIEWS_REPOSITORY,
          useValue: {
            findByFreightAndReviewer: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get(ApplicationsService);
    applicationsRepo = module.get(APPLICATIONS_REPOSITORY);
    freightsRepo = module.get(FREIGHTS_REPOSITORY);
  });

  describe('create', () => {
    const dto: CreateApplicationDto = {
      vehicleId: 'vehicle-1',
      proposedValue: 500,
    };

    it('should create an application successfully', async () => {
      const freight = mockFreight();
      const application = mockApplication();
      freightsRepo.findById.mockResolvedValue(freight);
      applicationsRepo.findByFreightAndFreighter.mockResolvedValue(null);
      applicationsRepo.validateVehicleOwnership.mockResolvedValue(true);
      applicationsRepo.create.mockResolvedValue(application);

      const result = await service.create('freight-1', 'carrier-1', dto);

      expect(result.id).toBe('app-1');
      expect(applicationsRepo.create).toHaveBeenCalledWith({
        freightId: 'freight-1',
        freighterId: 'carrier-1',
        vehicleId: 'vehicle-1',
        proposedPrice: '500',
      });
    });

    it('should throw NotFoundException when freight does not exist', async () => {
      freightsRepo.findById.mockResolvedValue(null);

      await expect(
        service.create('freight-1', 'carrier-1', dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when freight is not OPEN', async () => {
      freightsRepo.findById.mockResolvedValue(
        mockFreight({ status: FreightStatus.IN_PROGRESS }),
      );

      await expect(
        service.create('freight-1', 'carrier-1', dto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException when application already exists', async () => {
      freightsRepo.findById.mockResolvedValue(mockFreight());
      applicationsRepo.findByFreightAndFreighter.mockResolvedValue(
        mockApplication(),
      );

      await expect(
        service.create('freight-1', 'carrier-1', dto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllByFreight', () => {
    it('should return applications for an owned freight', async () => {
      const applications = [mockApplication()];
      freightsRepo.findByIdAndClient.mockResolvedValue(mockFreight());
      applicationsRepo.findByFreight.mockResolvedValue(applications);

      const result = await service.findAllByFreight('freight-1', 'client-1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('app-1');
    });

    it('should throw NotFoundException when freight not found or not owned', async () => {
      freightsRepo.findByIdAndClient.mockResolvedValue(null);

      await expect(
        service.findAllByFreight('freight-1', 'other-client'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return application when requester is the freighter', async () => {
      applicationsRepo.findById.mockResolvedValue(mockApplication());

      const result = await service.findOne('app-1', 'carrier-1');

      expect(result.id).toBe('app-1');
      expect(freightsRepo.findById).not.toHaveBeenCalled();
    });

    it('should return application when requester is the freight client', async () => {
      applicationsRepo.findById.mockResolvedValue(mockApplication());
      freightsRepo.findById.mockResolvedValue(mockFreight());

      const result = await service.findOne('app-1', 'client-1');

      expect(result.id).toBe('app-1');
    });

    it('should throw NotFoundException when application not found', async () => {
      applicationsRepo.findById.mockResolvedValue(null);

      await expect(service.findOne('app-1', 'any-user')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is neither freighter nor client', async () => {
      applicationsRepo.findById.mockResolvedValue(mockApplication());
      freightsRepo.findById.mockResolvedValue(mockFreight());

      await expect(service.findOne('app-1', 'stranger')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    const dto: UpdateApplicationDto = { proposedValue: 450 };

    it('should update proposedPrice when application is PENDING and owned', async () => {
      const updated = mockApplication({ proposedPrice: '450' });
      applicationsRepo.findById.mockResolvedValue(mockApplication());
      applicationsRepo.update.mockResolvedValue(updated);

      const result = await service.update('app-1', 'carrier-1', dto);

      expect(result.proposedPrice).toBe('450');
      expect(applicationsRepo.update).toHaveBeenCalledWith('app-1', {
        proposedPrice: '450',
      });
    });

    it('should throw ForbiddenException when not the owner', async () => {
      applicationsRepo.findById.mockResolvedValue(mockApplication());

      await expect(
        service.update('app-1', 'other-carrier', dto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when status is not PENDING', async () => {
      applicationsRepo.findById.mockResolvedValue(
        mockApplication({ status: ApplicationStatus.ACCEPTED }),
      );

      await expect(service.update('app-1', 'carrier-1', dto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('withdraw', () => {
    it('should withdraw a PENDING application', async () => {
      const withdrawn = mockApplication({
        status: ApplicationStatus.WITHDRAWN,
      });
      applicationsRepo.findById.mockResolvedValue(mockApplication());
      applicationsRepo.updateStatus.mockResolvedValue(withdrawn);

      const result = await service.withdraw('app-1', 'carrier-1');

      expect(result.status).toBe(ApplicationStatus.WITHDRAWN);
      expect(applicationsRepo.updateStatus).toHaveBeenCalledWith(
        'app-1',
        ApplicationStatus.WITHDRAWN,
        ApplicationStatus.PENDING,
      );
    });

    it('should throw ForbiddenException when status is not PENDING', async () => {
      applicationsRepo.findById.mockResolvedValue(
        mockApplication({ status: ApplicationStatus.ACCEPTED }),
      );

      await expect(service.withdraw('app-1', 'carrier-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('accept', () => {
    it('should accept a PENDING application via transaction', async () => {
      const accepted = mockApplication({ status: ApplicationStatus.ACCEPTED });
      applicationsRepo.findById.mockResolvedValue(mockApplication());
      freightsRepo.findByIdAndClient.mockResolvedValue(mockFreight());
      applicationsRepo.acceptApplication.mockResolvedValue(accepted);

      const result = await service.accept('app-1', 'client-1');

      expect(result.status).toBe(ApplicationStatus.ACCEPTED);
      expect(applicationsRepo.acceptApplication).toHaveBeenCalledWith('app-1');
    });

    it('should throw NotFoundException when application not found', async () => {
      applicationsRepo.findById.mockResolvedValue(null);

      await expect(service.accept('app-1', 'client-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when freight not owned by client', async () => {
      applicationsRepo.findById.mockResolvedValue(mockApplication());
      freightsRepo.findByIdAndClient.mockResolvedValue(null);

      await expect(service.accept('app-1', 'other-client')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when application is not PENDING', async () => {
      applicationsRepo.findById.mockResolvedValue(
        mockApplication({ status: ApplicationStatus.WITHDRAWN }),
      );
      freightsRepo.findByIdAndClient.mockResolvedValue(mockFreight());

      await expect(service.accept('app-1', 'client-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('reject', () => {
    it('should reject a PENDING application', async () => {
      const rejected = mockApplication({ status: ApplicationStatus.REJECTED });
      applicationsRepo.findById.mockResolvedValue(mockApplication());
      freightsRepo.findByIdAndClient.mockResolvedValue(mockFreight());
      applicationsRepo.updateStatus.mockResolvedValue(rejected);

      const result = await service.reject('app-1', 'client-1');

      expect(result.status).toBe(ApplicationStatus.REJECTED);
    });

    it('should throw NotFoundException when freight not owned by client', async () => {
      applicationsRepo.findById.mockResolvedValue(mockApplication());
      freightsRepo.findByIdAndClient.mockResolvedValue(null);

      await expect(service.reject('app-1', 'other-client')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when application is not PENDING', async () => {
      applicationsRepo.findById.mockResolvedValue(
        mockApplication({ status: ApplicationStatus.ACCEPTED }),
      );
      freightsRepo.findByIdAndClient.mockResolvedValue(mockFreight());

      await expect(service.reject('app-1', 'client-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('complete', () => {
    it('should complete an ACCEPTED application as client', async () => {
      const completed = mockApplication({
        status: ApplicationStatus.COMPLETED,
      });
      applicationsRepo.findById.mockResolvedValue(
        mockApplication({ status: ApplicationStatus.ACCEPTED }),
      );
      freightsRepo.findById.mockResolvedValue(mockFreight());
      applicationsRepo.completeApplication.mockResolvedValue(completed);

      const result = await service.complete('app-1', 'client-1');

      expect(result.status).toBe(ApplicationStatus.COMPLETED);
      expect(applicationsRepo.completeApplication).toHaveBeenCalledWith(
        'app-1',
      );
    });

    it('should complete an ACCEPTED application as freighter', async () => {
      const completed = mockApplication({
        status: ApplicationStatus.COMPLETED,
      });
      applicationsRepo.findById.mockResolvedValue(
        mockApplication({ status: ApplicationStatus.ACCEPTED }),
      );
      freightsRepo.findById.mockResolvedValue(mockFreight());
      applicationsRepo.completeApplication.mockResolvedValue(completed);

      const result = await service.complete('app-1', 'carrier-1');

      expect(result.status).toBe(ApplicationStatus.COMPLETED);
    });

    it('should throw ForbiddenException when user is unrelated', async () => {
      applicationsRepo.findById.mockResolvedValue(
        mockApplication({ status: ApplicationStatus.ACCEPTED }),
      );
      freightsRepo.findById.mockResolvedValue(mockFreight());

      await expect(service.complete('app-1', 'stranger')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when application is not ACCEPTED', async () => {
      applicationsRepo.findById.mockResolvedValue(mockApplication());
      freightsRepo.findById.mockResolvedValue(mockFreight());

      await expect(service.complete('app-1', 'client-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
