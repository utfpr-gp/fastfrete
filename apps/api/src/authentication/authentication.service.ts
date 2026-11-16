import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../common/crypto/crypto.service';
import { MailerService } from '../common/mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordForgotDto } from './dto/password-forgot.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserMapper } from '../users/mappers/user.mapper';
import type { JwtPayload } from './strategies/jwt.strategy';

const includeUserRoles = {
  city: true,
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
    private readonly mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { name, email, password, phoneNumber, roleType, cityId } =
      registerDto;

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

    const city = await this.prisma.city.findUnique({
      where: { id: cityId },
      select: { id: true },
    });

    if (!city) {
      throw new BadRequestException(`City with id ${cityId} not found`);
    }

    const hashedPassword = await this.cryptoService.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        cityId,
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

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException(
        'Conta suspensa. Entre em contato com o suporte.',
      );
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

  async forgotPassword(dto: PasswordForgotDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Resposta genérica para não revelar se o email existe
    if (!user) return;

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });
    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    await this.mailerService.sendPasswordReset(user.email, token);
  }

  async resetPassword(dto: PasswordResetDto): Promise<void> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });

    if (!resetToken) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    if (resetToken.expiresAt < new Date()) {
      await this.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      throw new BadRequestException('Token inválido ou expirado');
    }

    const hashedPassword = await this.cryptoService.hashPassword(dto.password);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);
  }
}
