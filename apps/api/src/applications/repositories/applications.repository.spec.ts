import { ConflictException } from '@nestjs/common';
import { ApplicationsRepository } from './applications.repository';

// Aceite concorrente: as atualizações condicionais fazem a segunda requisição
// encontrar o frete ou a proposta já fora do estado esperado.
describe('ApplicationsRepository.acceptApplication', () => {
  function build(freightCount: number, applicationCount: number) {
    const tx = {
      application: {
        findUniqueOrThrow: jest.fn().mockResolvedValue({ id: 'app-1', freightId: 'freight-1' }),
        updateMany: jest.fn().mockResolvedValue({ count: applicationCount }),
      },
      freight: {
        updateMany: jest.fn().mockResolvedValue({ count: freightCount }),
      },
    };
    const prisma = {
      $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
    };
    const repo = new ApplicationsRepository(prisma as never);
    return { repo, tx };
  }

  it('recusa com 409 quando o frete já não está aberto', async () => {
    const { repo, tx } = build(0, 1);
    await expect(repo.acceptApplication('app-1')).rejects.toThrow(ConflictException);
    expect(tx.freight.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'freight-1', status: 'OPEN' } }),
    );
    expect(tx.application.updateMany).not.toHaveBeenCalled();
  });

  it('recusa com 409 quando a proposta já não está pendente', async () => {
    const { repo, tx } = build(1, 0);
    await expect(repo.acceptApplication('app-1')).rejects.toThrow(ConflictException);
    expect(tx.application.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'app-1', status: 'PENDING' } }),
    );
  });

  it('recusa com 409 a retirada de uma proposta que já mudou de status', async () => {
    const prisma = {
      application: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        findUniqueOrThrow: jest.fn(),
      },
    };
    const repo = new ApplicationsRepository(prisma as never);
    await expect(
      repo.updateStatus('app-1', 'WITHDRAWN' as never, 'PENDING' as never),
    ).rejects.toThrow(ConflictException);
    expect(prisma.application.updateMany).toHaveBeenCalledWith({
      where: { id: 'app-1', status: 'PENDING' },
      data: { status: 'WITHDRAWN' },
    });
  });

  it('recusa com 409 a conclusão quando o frete não está em andamento', async () => {
    const tx = {
      application: {
        findUniqueOrThrow: jest.fn().mockResolvedValue({ id: 'app-1', freightId: 'freight-1' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      freight: { updateMany: jest.fn().mockResolvedValue({ count: 0 }) },
    };
    const prisma = { $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)) };
    const repo = new ApplicationsRepository(prisma as never);
    await expect(repo.completeApplication('app-1')).rejects.toThrow(ConflictException);
  });
});
