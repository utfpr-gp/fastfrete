import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  USERS_REPOSITORY,
  IUsersRepository,
  PublicProfileData,
} from './repositories/users.repository.interface';
import { CryptoService } from '../common/crypto/crypto.service';
import { RoleTypeEnum } from '../authorization/definitions/role-types.definition';
import { UserStatus } from './entities/user.entity';

const profileData = (
  overrides: Partial<PublicProfileData> = {},
): PublicProfileData => ({
  id: 'user-1',
  name: 'Ana Souza',
  status: UserStatus.ACTIVE,
  roleType: RoleTypeEnum.CUSTOMER,
  cityName: 'Guarapuava',
  memberSince: new Date('2026-01-01'),
  averageRating: 4.66,
  totalReviews: 3,
  completedFreights: 2,
  vehicles: [],
  ...overrides,
});

describe('UsersService.getPublicProfile', () => {
  let service: UsersService;
  let repository: { getPublicProfile: jest.Mock };

  beforeEach(async () => {
    repository = { getPublicProfile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY,
          useValue: repository as unknown as IUsersRepository,
        },
        { provide: CryptoService, useValue: {} },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('abbreviates the name of a customer', async () => {
    repository.getPublicProfile.mockResolvedValue(profileData());

    const result = await service.getPublicProfile('user-1');

    expect(result.name).toBe('Ana S.');
  });

  it('keeps the full name of a carrier and returns its vehicles', async () => {
    const vehicles = [
      {
        id: 'v1',
        vehicleCategoryName: 'Van',
        model: 'Renault Master',
        capacityKg: 1200,
      },
    ];
    repository.getPublicProfile.mockResolvedValue(
      profileData({
        name: 'Jane Smith',
        roleType: RoleTypeEnum.CARRIER,
        vehicles,
      }),
    );

    const result = await service.getPublicProfile('user-1');

    expect(result.name).toBe('Jane Smith');
    expect(result.vehicles).toEqual(vehicles);
  });

  it('rounds the average rating to one decimal place', async () => {
    repository.getPublicProfile.mockResolvedValue(profileData());

    const result = await service.getPublicProfile('user-1');

    expect(result.stats).toEqual({
      averageRating: 4.7,
      totalReviews: 3,
      completedFreights: 2,
    });
  });

  it('forwards the includeSuspended flag to the repository', async () => {
    repository.getPublicProfile.mockResolvedValue(
      profileData({ status: UserStatus.SUSPENDED }),
    );

    const result = await service.getPublicProfile('user-1', true);

    expect(repository.getPublicProfile).toHaveBeenCalledWith('user-1', true);
    expect(result.status).toBe(UserStatus.SUSPENDED);
  });

  it('hides suspended users by default', async () => {
    repository.getPublicProfile.mockResolvedValue(null);

    await expect(service.getPublicProfile('user-1')).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.getPublicProfile).toHaveBeenCalledWith('user-1', false);
  });

  it('throws NotFoundException when the profile does not exist', async () => {
    repository.getPublicProfile.mockResolvedValue(null);

    await expect(service.getPublicProfile('missing')).rejects.toThrow(
      NotFoundException,
    );
  });
});
