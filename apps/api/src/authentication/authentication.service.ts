import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../common/crypto/crypto.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserMapper } from '../users/mappers/user.mapper';
import type { JwtPayload } from './strategies/jwt.strategy';

const includeUserRoles = {
  userRoles: {
    include: {
      role: {
        include: {
          roleType: true,
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
};

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { name, email, password, phoneNumber, roleType } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const role = await this.prisma.role.findFirst({
      where: {
        roleType: {
          name: roleType,
        },
      },
    });

    if (!role) {
      throw new BadRequestException(`Role for type ${roleType} not found`);
    }

    const hashedPassword = await this.cryptoService.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        userRoles: {
          create: {
            roleId: role.id,
          },
        },
      },
      include: includeUserRoles,
    });

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const domainUser = UserMapper.toDomain(user);
    const userResponse = UserMapper.toResponse(domainUser);

    return {
      accessToken,
      user: userResponse,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: includeUserRoles,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.cryptoService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const domainUser = UserMapper.toDomain(user);
    const userResponse = UserMapper.toResponse(domainUser);

    return {
      accessToken,
      user: userResponse,
    };
  }
}
