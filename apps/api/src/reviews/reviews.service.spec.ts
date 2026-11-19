import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  REVIEWS_REPOSITORY,
  IReviewsRepository,
} from './repositories/reviews.repository.interface';
import {
  FREIGHTS_REPOSITORY,
  IFreightsRepository,
} from '../freights/repositories/freights.repository.interface';
import {
  APPLICATIONS_REPOSITORY,
  IApplicationsRepository,
} from '../applications/repositories/applications.repository.interface';
import { Review } from './entities/review.entity';
import {
  Freight,
  FreightStatus,
  FreightDateMode,
} from '../freights/entities/freight.entity';
import {
  Application,
  ApplicationStatus,
} from '../applications/entities/application.entity';
import { CreateReviewDto } from './dto/create-review.dto';

const mockReview = (overrides: Partial<Review> = {}): Review =>
  new Review({
    id: 'review-1',
    freightId: 'freight-1',
    reviewerId: 'client-1',
    reviewedId: 'carrier-1',
    rating: 5,
    comment: 'Excelente serviço',
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
    status: FreightStatus.COMPLETED,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    selectedApplicationId: 'app-1',
    originCity: { id: 'city-1', name: 'Curitiba', state: 'PR' },
    destinationCity: { id: 'city-2', name: 'Londrina', state: 'PR' },
    coverPhoto: null,
    ...overrides,
  });

const mockApplication = (
  overrides: Partial<Application> = {},
): Application =>
  new Application({
    id: 'app-1',
    freightId: 'freight-1',
    freighterId: 'carrier-1',
    vehicleId: 'vehicle-1',
    vehicle: null,
    proposedPrice: '500.00',
    status: ApplicationStatus.COMPLETED,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  });

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewsRepo: jest.Mocked<IReviewsRepository>;
  let freightsRepo: jest.Mocked<IFreightsRepository>;
  let applicationsRepo: jest.Mocked<IApplicationsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: REVIEWS_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByFreightAndReviewer: jest.fn(),
            findByReviewed: jest.fn(),
            findByFreight: jest.fn(),
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
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewsRepo = module.get(REVIEWS_REPOSITORY);
    freightsRepo = module.get(FREIGHTS_REPOSITORY);
    applicationsRepo = module.get(APPLICATIONS_REPOSITORY);
  });

  describe('create', () => {
    it('deve criar avaliação quando frete está concluído e usuário é o cliente', async () => {
      const dto: CreateReviewDto = { rating: 5, comment: 'Excelente' };
      const freight = mockFreight();
      const application = mockApplication();
      const review = mockReview();

      freightsRepo.findById.mockResolvedValue(freight);
      applicationsRepo.findById.mockResolvedValue(application);
      reviewsRepo.findByFreightAndReviewer.mockResolvedValue(null);
      reviewsRepo.create.mockResolvedValue(review);

      const result = await service.create('freight-1', 'client-1', dto);

      expect(result).toBeDefined();
      expect(result.rating).toBe(5);
      expect(reviewsRepo.create).toHaveBeenCalledWith({
        freightId: 'freight-1',
        reviewerId: 'client-1',
        reviewedId: 'carrier-1',
        rating: 5,
        comment: 'Excelente',
      });
    });

    it('deve lançar NotFoundException quando frete não existe', async () => {
      freightsRepo.findById.mockResolvedValue(null);

      await expect(
        service.create('freight-1', 'client-1', { rating: 5 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException quando frete não está concluído', async () => {
      const freight = mockFreight({ status: FreightStatus.OPEN });
      freightsRepo.findById.mockResolvedValue(freight);

      await expect(
        service.create('freight-1', 'client-1', { rating: 5 }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ConflictException quando usuário já avaliou o frete', async () => {
      const freight = mockFreight();
      const application = mockApplication();
      const existingReview = mockReview();

      freightsRepo.findById.mockResolvedValue(freight);
      applicationsRepo.findById.mockResolvedValue(application);
      reviewsRepo.findByFreightAndReviewer.mockResolvedValue(existingReview);

      await expect(
        service.create('freight-1', 'client-1', { rating: 5 }),
      ).rejects.toThrow(ConflictException);
    });

    it('deve lançar ForbiddenException quando usuário não faz parte do frete', async () => {
      const freight = mockFreight();
      const application = mockApplication();

      freightsRepo.findById.mockResolvedValue(freight);
      applicationsRepo.findById.mockResolvedValue(application);

      await expect(
        service.create('freight-1', 'user-999', { rating: 5 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByFreight', () => {
    it('deve retornar lista de avaliações do frete', async () => {
      const freight = mockFreight();
      const reviews = [mockReview()];

      freightsRepo.findById.mockResolvedValue(freight);
      reviewsRepo.findByFreight.mockResolvedValue(reviews);

      const result = await service.findByFreight('freight-1');

      expect(result).toHaveLength(1);
      expect(result[0].rating).toBe(5);
    });

    it('deve lançar NotFoundException quando frete não existe', async () => {
      freightsRepo.findById.mockResolvedValue(null);

      await expect(service.findByFreight('freight-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
