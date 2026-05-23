import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CryptoModule } from './common/crypto/crypto.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { FreightsModule } from './freights/freights.module';

@Module({
  imports: [
    PrismaModule,
    CryptoModule,
    AuthorizationModule,
    AuthenticationModule,
    UsersModule,
    FreightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
