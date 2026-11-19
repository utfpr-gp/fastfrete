import { CryptoService } from '../../src/common/crypto/crypto.service';

export type MockCryptoService = {
  [K in keyof CryptoService]: jest.Mock;
};

export const createMockCryptoService = (): MockCryptoService => ({
  hashPassword: jest
    .fn()
    .mockImplementation((password: string) =>
      Promise.resolve(`hashed_${password}`),
    ),
  comparePassword: jest
    .fn()
    .mockImplementation((plain: string, hashed: string) =>
      Promise.resolve(hashed === `hashed_${plain}`),
    ),
});
