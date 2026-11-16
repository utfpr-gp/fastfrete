import { Module } from '@nestjs/common';
import { CarriersService } from './carriers.service.js';
import { CarriersController } from './controllers/carriers.controller.js';
import { CARRIERS_REPOSITORY } from './repositories/carriers.repository.interface.js';
import { CarriersRepository } from './repositories/carriers.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CarriersController],
  providers: [
    CarriersService,
    {
      provide: CARRIERS_REPOSITORY,
      useClass: CarriersRepository,
    },
  ],
  exports: [CarriersService],
})
export class CarriersModule {}
