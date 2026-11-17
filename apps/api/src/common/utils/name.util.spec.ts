import { abbreviateName } from './name.util';

describe('abbreviateName', () => {
  it('abbreviates the last name to its initial', () => {
    expect(abbreviateName('Ana Souza')).toBe('Ana S.');
  });

  it('uses the last word as the surname', () => {
    expect(abbreviateName('Maria da Silva Santos')).toBe('Maria S.');
  });

  it('keeps a single name unchanged', () => {
    expect(abbreviateName('Ana')).toBe('Ana');
  });

  it('trims extra whitespace', () => {
    expect(abbreviateName('  joão   pereira ')).toBe('joão P.');
  });
});
