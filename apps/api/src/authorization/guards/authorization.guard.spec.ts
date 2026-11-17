import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationGuard } from './authorization.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLE_TYPES_KEY } from '../decorators/role-types.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

function contextFor(user?: { roleTypes: string[]; permissions: string[] }) {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('AuthorizationGuard', () => {
  let reflector: Reflector;
  let guard: AuthorizationGuard;
  let metadata: Record<string, unknown>;

  beforeEach(() => {
    metadata = {};
    reflector = {
      getAllAndOverride: jest.fn((key: string) => metadata[key]),
    } as unknown as Reflector;
    guard = new AuthorizationGuard(reflector);
  });

  it('libera rotas marcadas como públicas', () => {
    metadata[IS_PUBLIC_KEY] = true;
    metadata[ROLE_TYPES_KEY] = ['ADMIN'];
    expect(guard.canActivate(contextFor())).toBe(true);
  });

  it('libera quando o usuário tem o tipo de papel exigido', () => {
    metadata[ROLE_TYPES_KEY] = ['CUSTOMER'];
    const ctx = contextFor({ roleTypes: ['CUSTOMER'], permissions: [] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('libera quando o usuário tem a permissão exigida', () => {
    metadata[PERMISSIONS_KEY] = ['freights:create'];
    const ctx = contextFor({ roleTypes: [], permissions: ['freights:create'] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('recusa um fretista em rota exclusiva de cliente', () => {
    metadata[ROLE_TYPES_KEY] = ['CUSTOMER'];
    metadata[PERMISSIONS_KEY] = ['freights:create'];
    const ctx = contextFor({ roleTypes: ['CARRIER'], permissions: ['freights:list'] });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('exige papel e permissão quando a rota declara os dois', () => {
    metadata[ROLE_TYPES_KEY] = ['CUSTOMER'];
    metadata[PERMISSIONS_KEY] = ['freights:list'];
    // fretista também tem freights:list, mas não é cliente
    const ctx = contextFor({ roleTypes: ['CARRIER'], permissions: ['freights:list'] });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('recusa quando não há usuário autenticado na requisição', () => {
    metadata[ROLE_TYPES_KEY] = ['ADMIN'];
    expect(() => guard.canActivate(contextFor())).toThrow(ForbiddenException);
  });
});
