import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../common/crypto/crypto.service';
import { MailerService } from '../common/mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';
import { RoleTypeEnum } from '../authorization/definitions/role-types.definition';

const createdUser = (roleType: RoleTypeEnum) => ({
  id: 'user-1',
  name: 'Jane Smith',
  email: 'jane@example.com',
  password: 'hashed',
  phoneNumber: '+5542999998888',
  status: 'ACTIVE',
  suspensionReason: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  cityId: 'city-1',
  city: { id: 'city-1', name: 'Guarapuava', state: 'PR' },
  userRoles: [
    {
      role: {
        name: roleType,
        roleType: { name: roleType },
        rolePermissions: [],
      },
    },
  ],
});

const baseDto = (overrides: Partial<RegisterDto> = {}): RegisterDto => ({
  name: 'Jane Smith',
  email: 'jane@example.com',
  password: 'SenhaForte123',
  phoneNumber: '+5542999998888',
  roleType: RoleTypeEnum.CUSTOMER,
  cityId: 'city-1',
  ...overrides,
});

describe('AuthenticationService.register', () => {
  let service: AuthenticationService;
  let prisma: {
    user: { findUnique: jest.Mock; create: jest.Mock };
    role: { findFirst: jest.Mock };
    city: { findUnique: jest.Mock };
    vehicleCategory: { findUnique: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      },
      role: { findFirst: jest.fn().mockResolvedValue({ id: 'role-1' }) },
      city: { findUnique: jest.fn().mockResolvedValue({ id: 'city-1' }) },
      vehicleCategory: {
        findUnique: jest.fn().mockResolvedValue({ id: 'category-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('token') },
        },
        {
          provide: CryptoService,
          useValue: { hashPassword: jest.fn().mockResolvedValue('hashed') },
        },
        { provide: MailerService, useValue: {} },
      ],
    }).compile();

    service = module.get(AuthenticationService);
  });

  it('creates a customer without a vehicle', async () => {
    prisma.user.create.mockResolvedValue(createdUser(RoleTypeEnum.CUSTOMER));

    const result = await service.register(baseDto());

    expect(prisma.user.create.mock.calls[0][0].data.vehicles).toBeUndefined();
    expect(prisma.vehicleCategory.findUnique).not.toHaveBeenCalled();
    expect(result.accessToken).toBe('token');
  });

  it('creates the vehicle together with a carrier', async () => {
    prisma.user.create.mockResolvedValue(createdUser(RoleTypeEnum.CARRIER));

    await service.register(
      baseDto({
        roleType: RoleTypeEnum.CARRIER,
        vehicle: {
          vehicleCategory: 'Van',
          model: 'Renault Master 2019',
          capacityKg: 1200,
        },
      }),
    );

    expect(prisma.vehicleCategory.findUnique).toHaveBeenCalledWith({
      where: { name: 'Van' },
      select: { id: true },
    });
    expect(prisma.user.create.mock.calls[0][0].data.vehicles).toEqual({
      create: {
        vehicleCategoryId: 'category-1',
        model: 'Renault Master 2019',
        capacityKg: 1200,
        plate: undefined,
        color: undefined,
      },
    });
  });

  it('rejects a carrier without a vehicle', async () => {
    await expect(
      service.register(baseDto({ roleType: RoleTypeEnum.CARRIER })),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('rejects a carrier with an unknown vehicle category', async () => {
    prisma.vehicleCategory.findUnique.mockResolvedValue(null);

    await expect(
      service.register(
        baseDto({
          roleType: RoleTypeEnum.CARRIER,
          vehicle: {
            vehicleCategory: 'Foguete',
            model: 'X',
            capacityKg: 100,
          },
        }),
      ),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('ignores the vehicle of a customer', async () => {
    prisma.user.create.mockResolvedValue(createdUser(RoleTypeEnum.CUSTOMER));

    await service.register(
      baseDto({
        vehicle: { vehicleCategory: 'Van', model: 'X', capacityKg: 100 },
      }),
    );

    expect(prisma.user.create.mock.calls[0][0].data.vehicles).toBeUndefined();
  });

  it('rejects an email that is already registered', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'other' });

    await expect(service.register(baseDto())).rejects.toThrow(
      ConflictException,
    );
  });
});
