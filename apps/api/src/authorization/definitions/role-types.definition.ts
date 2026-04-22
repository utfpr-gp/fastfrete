export enum RoleTypeEnum {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  CARRIER = 'CARRIER',
}

export const ROLE_TYPES = Object.values(RoleTypeEnum);

export interface RoleTypeDefinition {
  name: RoleTypeEnum;
}

export const ROLE_TYPE_DEFINITIONS: RoleTypeDefinition[] = ROLE_TYPES.map(
  (name) => ({ name }),
);
