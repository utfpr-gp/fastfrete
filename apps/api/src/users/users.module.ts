import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './controllers/users.controller.js';
import { AdminUsersController } from './controllers/admin.users.controller.js';
import { UsersRepository } from './repositories/users.repository.js';
import { USERS_REPOSITORY } from './repositories/users.repository.interface.js';

@Module({
  controllers: [UsersController, AdminUsersController],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
