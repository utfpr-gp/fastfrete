import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationModule } from '../../../src/authentication/authentication.module';
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { CryptoService } from '../../../src/common/crypto/crypto.service';
import { CryptoModule } from '../../../src/common/crypto/crypto.module';
import { AuthorizationModule } from '../../../src/authorization/authorization.module';
import { RoleTypeEnum } from '../../../src/authorization/definitions/role-types.definition';
import {
  createMockCryptoService,
  MockCryptoService,
} from '../../mocks/crypto.mock';
import {
  createMockPrismaService,
  MockPrismaService,
} from '../../mocks/prisma.mock';
import { AuthResponseDto } from '../../../src/authentication/dto/auth-response.dto';
import { ValidationExceptionFilter } from '../../../src/common/filters/validation-exception.filter';

const VALID_PASSWORD = 'Password1';

describe('AuthenticationController (Integration)', () => {
  let app: INestApplication<App>;
  let prisma: MockPrismaService;
  let cryptoService: MockCryptoService;
  let jwtService: JwtService;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    cryptoService = createMockCryptoService();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthenticationModule,
        PrismaModule,
        CryptoModule,
        AuthorizationModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .overrideProvider(CryptoService)
      .useValue(cryptoService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new ValidationExceptionFilter());
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new customer user', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: VALID_PASSWORD,
        phoneNumber: '+5511999999999',
        roleType: RoleTypeEnum.CUSTOMER,
        cityId: '11111111-1111-4111-8111-111111111111',
      };

      const mockRole = {
        id: 'role-id',
        name: RoleTypeEnum.CUSTOMER,
        roleTypeId: 'role-type-id',
      };

      const mockCity = {
        id: registerDto.cityId,
        name: 'Guarapuava',
        state: 'Paraná',
      };

      const mockUserWithRoles = {
        id: 'user-id',
        name: registerDto.name,
        email: registerDto.email,
        password: 'hashed-password',
        phoneNumber: registerDto.phoneNumber,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        cityId: mockCity.id,
        city: mockCity,
        userRoles: [
          {
            userId: 'user-id',
            roleId: mockRole.id,
            createdAt: new Date(),
            role: {
              id: mockRole.id,
              name: mockRole.name,
              roleTypeId: mockRole.roleTypeId,
              createdAt: new Date(),
              updatedAt: new Date(),
              roleType: {
                id: mockRole.roleTypeId,
                name: RoleTypeEnum.CUSTOMER,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              rolePermissions: [
                {
                  roleId: mockRole.id,
                  permissionId: 'perm-1',
                  createdAt: new Date(),
                  permission: {
                    id: 'perm-1',
                    name: 'profile:read',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                },
              ],
            },
          },
        ],
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findFirst.mockResolvedValue(mockRole);
      prisma.city.findUnique.mockResolvedValue(mockCity);
      prisma.user.create.mockResolvedValue(mockUserWithRoles);

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201);

      const body = response.body as AuthResponseDto;
      expect(body).toHaveProperty('accessToken');
      expect(body).toHaveProperty('user');
      expect(body.user.email).toBe(registerDto.email);
      expect(body.user.name).toBe(registerDto.name);
      expect(body.user.status).toBe('ACTIVE');
      expect(body.user).not.toHaveProperty('password');
      expect(body.user.roles).toHaveLength(1);
      expect(body.user.roles[0].roleType).toBe(RoleTypeEnum.CUSTOMER);
      expect(cryptoService.hashPassword).toHaveBeenCalledWith(
        registerDto.password,
      );
    });

    it('should register a new carrier user', async () => {
      const registerDto = {
        name: 'Carrier User',
        email: 'carrier@example.com',
        password: VALID_PASSWORD,
        phoneNumber: '+5511888888888',
        roleType: RoleTypeEnum.CARRIER,
        cityId: '11111111-1111-4111-8111-111111111111',
        vehicle: {
          vehicleCategory: 'Van',
          model: 'Renault Master 2019',
          capacityKg: 1200,
        },
      };

      const mockRole = {
        id: 'role-id',
        name: RoleTypeEnum.CARRIER,
        roleTypeId: 'role-type-id',
      };

      const mockCity = {
        id: registerDto.cityId,
        name: 'Guarapuava',
        state: 'Paraná',
      };

      const mockUserWithRoles = {
        id: 'user-id',
        name: registerDto.name,
        email: registerDto.email,
        password: 'hashed-password',
        phoneNumber: registerDto.phoneNumber,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        cityId: mockCity.id,
        city: mockCity,
        userRoles: [
          {
            userId: 'user-id',
            roleId: mockRole.id,
            createdAt: new Date(),
            role: {
              id: mockRole.id,
              name: mockRole.name,
              roleTypeId: mockRole.roleTypeId,
              createdAt: new Date(),
              updatedAt: new Date(),
              roleType: {
                id: mockRole.roleTypeId,
                name: RoleTypeEnum.CARRIER,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              rolePermissions: [],
            },
          },
        ],
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findFirst.mockResolvedValue(mockRole);
      prisma.city.findUnique.mockResolvedValue(mockCity);
      prisma.vehicleCategory.findUnique.mockResolvedValue({
        id: 'category-id',
        name: 'Van',
      });
      prisma.user.create.mockResolvedValue(mockUserWithRoles);

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201);

      const body = response.body as AuthResponseDto;
      expect(body).toHaveProperty('accessToken');
      expect(body.user.roles[0].roleType).toBe(RoleTypeEnum.CARRIER);
    });

    it('should return 409 when email already exists', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: VALID_PASSWORD,
        phoneNumber: '+5511999999999',
        roleType: RoleTypeEnum.CUSTOMER,
        cityId: '11111111-1111-4111-8111-111111111111',
      };

      prisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(409);
    });

    it('should return 400 for invalid roleType', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: VALID_PASSWORD,
        phoneNumber: '+5511999999999',
        roleType: 'ADMIN',
        cityId: '11111111-1111-4111-8111-111111111111',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ name: 'John' })
        .expect(400);
    });

    it('should return 400 for missing phone number', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: VALID_PASSWORD,
        roleType: RoleTypeEnum.CUSTOMER,
        cityId: '11111111-1111-4111-8111-111111111111',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(400);

      const body = response.body as { errors: Record<string, string[]> };
      expect(body.errors).toHaveProperty('phoneNumber');
    });

    it('should return 400 for invalid email', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'invalid-email',
        password: VALID_PASSWORD,
        phoneNumber: '+5511999999999',
        roleType: RoleTypeEnum.CUSTOMER,
        cityId: '11111111-1111-4111-8111-111111111111',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should return 400 for weak password', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345678',
        phoneNumber: '+5511999999999',
        roleType: RoleTypeEnum.CUSTOMER,
        cityId: '11111111-1111-4111-8111-111111111111',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(400);

      const body = response.body as { errors: Record<string, string[]> };
      expect(body.errors).toHaveProperty('password');
    });

    it('should return 400 for short name', async () => {
      const registerDto = {
        name: 'Jo',
        email: 'john@example.com',
        password: VALID_PASSWORD,
        phoneNumber: '+5511999999999',
        roleType: RoleTypeEnum.CUSTOMER,
        cityId: '11111111-1111-4111-8111-111111111111',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(400);

      const body = response.body as { errors: Record<string, string[]> };
      expect(body.errors).toHaveProperty('name');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: VALID_PASSWORD,
      };

      const mockUserWithRoles = {
        id: 'user-id',
        name: 'John Doe',
        email: loginDto.email,
        password: 'hashed-password',
        phoneNumber: '+5511999999999',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        cityId: '11111111-1111-4111-8111-111111111111',
        city: {
          id: '11111111-1111-4111-8111-111111111111',
          name: 'Guarapuava',
          state: 'Paraná',
        },
        userRoles: [
          {
            userId: 'user-id',
            roleId: 'role-id',
            createdAt: new Date(),
            role: {
              id: 'role-id',
              name: RoleTypeEnum.CUSTOMER,
              roleTypeId: 'role-type-id',
              createdAt: new Date(),
              updatedAt: new Date(),
              roleType: {
                id: 'role-type-id',
                name: RoleTypeEnum.CUSTOMER,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              rolePermissions: [
                {
                  roleId: 'role-id',
                  permissionId: 'perm-1',
                  createdAt: new Date(),
                  permission: {
                    id: 'perm-1',
                    name: 'profile:read',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                },
              ],
            },
          },
        ],
      };

      prisma.user.findUnique.mockResolvedValue(mockUserWithRoles);
      cryptoService.comparePassword.mockResolvedValue(true);

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(200);

      const body = response.body as AuthResponseDto;
      expect(body).toHaveProperty('accessToken');
      expect(body).toHaveProperty('user');
      expect(body.user.email).toBe(loginDto.email);
      expect(body.user).not.toHaveProperty('password');
      expect(body.user.roles).toHaveLength(1);
      expect(cryptoService.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockUserWithRoles.password,
      );
    });

    it('should return 401 for non-existent user', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: VALID_PASSWORD,
      };

      prisma.user.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should return 401 for invalid password', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'WrongPassword1',
      };

      const mockUser = {
        id: 'user-id',
        email: loginDto.email,
        password: 'hashed-password',
        userRoles: [],
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      cryptoService.comparePassword.mockResolvedValue(false);

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should return 400 for missing credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'john@example.com' })
        .expect(400);
    });

    it('should return 400 for invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'invalid-email', password: VALID_PASSWORD })
        .expect(400);
    });
  });

  describe('JWT Token', () => {
    it('should return a valid JWT token on login', async () => {
      const mockUserWithRoles = {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        phoneNumber: '+5511999999999',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        cityId: '11111111-1111-4111-8111-111111111111',
        city: {
          id: '11111111-1111-4111-8111-111111111111',
          name: 'Guarapuava',
          state: 'Paraná',
        },
        userRoles: [],
      };

      prisma.user.findUnique.mockResolvedValue(mockUserWithRoles);
      cryptoService.comparePassword.mockResolvedValue(true);

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'john@example.com', password: VALID_PASSWORD })
        .expect(200);

      const body = response.body as AuthResponseDto;
      const decoded: { sub: string; email: string } = jwtService.verify(
        body.accessToken,
      );
      expect(decoded.sub).toBe(mockUserWithRoles.id);
      expect(decoded.email).toBe(mockUserWithRoles.email);
    });
  });
});
