import { UnauthorizedException } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

// A cada requisição o usuário é recarregado do banco: uma conta suspensa
// perde o acesso mesmo com um token ainda válido (HU10).
describe('AuthorizationService', () => {
  const userWithRole = (status: 'ACTIVE' | 'SUSPENDED') => ({
    id: 'user-1',
    email: 'user@exemplo.com',
    status,
    userRoles: [
      {
        role: {
          name: 'carrier',
          roleType: { name: 'CARRIER' },
          rolePermissions: [{ permission: { name: 'freights:list' } }],
        },
      },
    ],
  });

  function build(user: unknown) {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue(user) } };
    return new AuthorizationService(prisma as never);
  }

  it('carrega papéis e permissões de um usuário ativo', async () => {
    const data = await build(userWithRole('ACTIVE')).getUserAuthorizationData(
      'user-1',
    );
    expect(data?.roleTypes).toContain('CARRIER');
    expect(data?.permissions).toContain('freights:list');
  });

  it('bloqueia um usuário suspenso mesmo com token válido', async () => {
    await expect(
      build(userWithRole('SUSPENDED')).getUserAuthorizationData('user-1'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('retorna nulo quando o usuário não existe mais', async () => {
    await expect(
      build(null).getUserAuthorizationData('user-1'),
    ).resolves.toBeNull();
  });
});
