import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { CryptoModule } from '../common/crypto/crypto.module';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [
    PrismaModule,
    CryptoModule,
    AuthorizationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => {
        return {
          secret:
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
          },
        } as JwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}
