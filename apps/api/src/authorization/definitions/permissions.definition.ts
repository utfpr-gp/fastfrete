import { RoleTypeEnum } from './role-types.definition';

export const ADMIN_PERMISSIONS = {
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_LIST: 'users:list',
  ROLES_CREATE: 'roles:create',
  ROLES_READ: 'roles:read',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
  ROLES_LIST: 'roles:list',
  ROLES_ASSIGN: 'roles:assign',
  VEHICLE_CATEGORIES_CREATE: 'vehicle-categories:create',
  VEHICLE_CATEGORIES_READ: 'vehicle-categories:read',
  VEHICLE_CATEGORIES_UPDATE: 'vehicle-categories:update',
  VEHICLE_CATEGORIES_DELETE: 'vehicle-categories:delete',
  VEHICLE_CATEGORIES_LIST: 'vehicle-categories:list',
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_LOGS: 'system:logs',
} as const;

export const CUSTOMER_PERMISSIONS = {
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
  ORDERS_CREATE: 'orders:create',
  ORDERS_READ: 'orders:read',
  ORDERS_LIST: 'orders:list',
  ORDERS_CANCEL: 'orders:cancel',
  FREIGHTS_CREATE: 'freights:create',
  FREIGHTS_READ: 'freights:read',
  FREIGHTS_LIST: 'freights:list',
  FREIGHTS_UPDATE: 'freights:update',
  FREIGHTS_CANCEL: 'freights:cancel',
  APPLICATIONS_READ: 'applications:read',
  APPLICATIONS_LIST: 'applications:list',
  APPLICATIONS_ACCEPT: 'applications:accept',
  APPLICATIONS_REJECT: 'applications:reject',
  APPLICATIONS_COMPLETE: 'applications:complete',
} as const;

export const CARRIER_PERMISSIONS = {
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
  DELIVERIES_READ: 'deliveries:read',
  DELIVERIES_LIST: 'deliveries:list',
  DELIVERIES_ACCEPT: 'deliveries:accept',
  DELIVERIES_UPDATE_STATUS: 'deliveries:update-status',
  APPLICATIONS_CREATE: 'applications:create',
  APPLICATIONS_READ: 'applications:read',
  APPLICATIONS_LIST: 'applications:list',
  APPLICATIONS_UPDATE: 'applications:update',
  APPLICATIONS_WITHDRAW: 'applications:withdraw',
  APPLICATIONS_COMPLETE: 'applications:complete',
  VEHICLES_CREATE: 'vehicles:create',
  VEHICLES_READ: 'vehicles:read',
  VEHICLES_LIST: 'vehicles:list',
  VEHICLES_UPDATE: 'vehicles:update',
  VEHICLES_DELETE: 'vehicles:delete',
} as const;

function getPermissionValues<T extends Record<string, string>>(
  permissionsMap: T,
): string[] {
  return Object.values(permissionsMap);
}

export interface PermissionsByRoleType {
  roleType: RoleTypeEnum;
  permissions: string[];
}

export const PERMISSIONS_BY_ROLE_TYPE: PermissionsByRoleType[] = [
  {
    roleType: RoleTypeEnum.ADMIN,
    permissions: getPermissionValues(ADMIN_PERMISSIONS),
  },
  {
    roleType: RoleTypeEnum.CUSTOMER,
    permissions: getPermissionValues(CUSTOMER_PERMISSIONS),
  },
  {
    roleType: RoleTypeEnum.CARRIER,
    permissions: getPermissionValues(CARRIER_PERMISSIONS),
  },
];

export const ALL_PERMISSIONS: string[] = [
  ...new Set([
    ...getPermissionValues(ADMIN_PERMISSIONS),
    ...getPermissionValues(CUSTOMER_PERMISSIONS),
    ...getPermissionValues(CARRIER_PERMISSIONS),
  ]),
];

export function getPermissionsForRoleType(roleType: RoleTypeEnum): string[] {
  const definition = PERMISSIONS_BY_ROLE_TYPE.find(
    (p) => p.roleType === roleType,
  );
  return definition?.permissions ?? [];
}
