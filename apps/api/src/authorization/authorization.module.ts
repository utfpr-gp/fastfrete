import { Global, Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationGuard } from './guards/authorization.guard';

@Global()
@Module({
  providers: [AuthorizationService, AuthorizationGuard],
  exports: [AuthorizationService, AuthorizationGuard],
})
export class AuthorizationModule {}
