/**
 * Stub para evitar carregar o client gerado (import.meta) nos testes Jest.
 * Os testes de integração sobrescrevem PrismaService com mocks.
 */
export class PrismaClient {
  constructor(options?: unknown) {
    void options;
  }

  async $connect(): Promise<void> {}

  async $disconnect(): Promise<void> {}
}
