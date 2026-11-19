// file-type é distribuído apenas como ESM; no teste e2e da rota raiz ele não é exercitado.
export const fileTypeFromBuffer = jest.fn(() => Promise.resolve(undefined));
