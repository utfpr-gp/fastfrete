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
import { ApplicationStatus } from '../applications/entities/application.entity';

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

const clientSummary = {
  name: 'Maria Silva Souza',
  averageRating: 4.66,
  totalReviews: 3,
  completedFreights: 2,
  phoneNumber: '+5542999990000',
};

// Regra RN03: o fretista só vê o número do endereço e o contato do cliente
// depois que a proposta dele é aceita.
describe('FreightsService - privacidade gradual (RN03)', () => {
  let service: FreightsService;
  let freightsRepo: Record<string, jest.Mock>;
  let applicationsRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    freightsRepo = {
      findOpenById: jest.fn(),
      findById: jest.fn(),
      getClientSummary: jest.fn().mockResolvedValue(clientSummary),
      findByIdAndClient: jest.fn(),
      cancelWithPendingApplications: jest.fn(),
    };
    applicationsRepo = { findByFreightAndFreighter: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreightsService,
        { provide: FREIGHTS_REPOSITORY, useValue: freightsRepo },
        { provide: APPLICATIONS_REPOSITORY, useValue: applicationsRepo },
        { provide: REVIEWS_REPOSITORY, useValue: {} },
      ],
    }).compile();

    service = module.get(FreightsService);
  });

  it('oculta o número do endereço e o contato em um frete aberto', async () => {
    freightsRepo.findOpenById.mockResolvedValue(mockFreight());

    const result = await service.findOneForCarrier('freight-1', 'carrier-1');

    expect(result.originNumber).toBe('');
    expect(result.destinationNumber).toBe('');
    expect(result.originStreet).toBe('Rua A');
    expect(result.client?.name).toBe('Maria S.');
    expect(result.client?.phoneNumber).toBeUndefined();
  });

  it('mantém os dados ocultos enquanto a proposta está pendente', async () => {
    freightsRepo.findOpenById.mockResolvedValue(null);
    freightsRepo.findById.mockResolvedValue(
      mockFreight({ status: FreightStatus.IN_PROGRESS }),
    );
    applicationsRepo.findByFreightAndFreighter.mockResolvedValue({
      status: ApplicationStatus.PENDING,
    });

    const result = await service.findOneForCarrier('freight-1', 'carrier-1');

    expect(result.originNumber).toBe('');
    expect(result.client?.phoneNumber).toBeUndefined();
  });

  it('revela endereço completo, nome e telefone ao fretista aceito', async () => {
    freightsRepo.findOpenById.mockResolvedValue(null);
    freightsRepo.findById.mockResolvedValue(
      mockFreight({ status: FreightStatus.IN_PROGRESS }),
    );
    applicationsRepo.findByFreightAndFreighter.mockResolvedValue({
      status: ApplicationStatus.ACCEPTED,
    });

    const result = await service.findOneForCarrier('freight-1', 'carrier-1');

    expect(result.originNumber).toBe('1');
    expect(result.destinationNumber).toBe('2');
    expect(result.client?.name).toBe('Maria Silva Souza');
    expect(result.client?.phoneNumber).toBe('+5542999990000');
  });

  it('nega o frete a um fretista sem proposta quando ele não está mais aberto', async () => {
    freightsRepo.findOpenById.mockResolvedValue(null);
    freightsRepo.findById.mockResolvedValue(
      mockFreight({ status: FreightStatus.IN_PROGRESS }),
    );
    applicationsRepo.findByFreightAndFreighter.mockResolvedValue(null);

    await expect(
      service.findOneForCarrier('freight-1', 'carrier-1'),
    ).rejects.toThrow('não está disponível');
  });

  it('cancela o frete junto com as propostas pendentes', async () => {
    freightsRepo.findByIdAndClient.mockResolvedValue(mockFreight());
    freightsRepo.cancelWithPendingApplications.mockResolvedValue(
      mockFreight({ status: FreightStatus.CANCELLED }),
    );

    const result = await service.cancel('freight-1', 'client-1');

    expect(freightsRepo.cancelWithPendingApplications).toHaveBeenCalledWith(
      'freight-1',
    );
    expect(result.status).toBe(FreightStatus.CANCELLED);
  });

  it('recusa com conflito quando o frete mudou de status antes do cancelamento', async () => {
    freightsRepo.findByIdAndClient.mockResolvedValue(mockFreight());
    freightsRepo.cancelWithPendingApplications.mockResolvedValue(null);

    await expect(service.cancel('freight-1', 'client-1')).rejects.toThrow(
      'não pode mais ser cancelado',
    );
  });
});
