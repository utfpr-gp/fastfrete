import { SetMetadata } from '@nestjs/common';
import { RoleTypeEnum } from '../definitions/role-types.definition';

export const ROLE_TYPES_KEY = 'roleTypes';

export const RoleTypes = (...roleTypes: RoleTypeEnum[]) =>
  SetMetadata(ROLE_TYPES_KEY, roleTypes);
