import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateFreightDto } from './create-freight.dto';

const validPayload = {
  title: 'Mudança residencial',
  description: 'Descrição do frete',
  vehicleCategory: 'Van',
  originCityId: '8e56ef10-3815-491d-b876-511f5e3b7de4',
  originDistrict: 'Centro',
  originStreet: 'Rua XV',
  originNumber: '10',
  destinationCityId: '8e56ef10-3815-491d-b876-511f5e3b7de4',
  destinationDistrict: 'Batel',
  destinationStreet: 'Rua Sete',
  destinationNumber: '20',
};

async function errorsFor(overrides: Record<string, unknown>) {
  const dto = plainToInstance(CreateFreightDto, {
    ...validPayload,
    ...overrides,
  });
  const errors = await validate(dto);
  return errors.map((error) => error.property);
}

describe('CreateFreightDto schedule validation', () => {
  it('accepts an immediate freight without date or window', async () => {
    expect(await errorsFor({ dateMode: 'IMMEDIATE' })).toEqual([]);
  });

  it('requires the exact date for a scheduled freight', async () => {
    expect(await errorsFor({ dateMode: 'SCHEDULED' })).toContain(
      'exactDatetime',
    );
  });

  it('rejects an invalid exact date for a scheduled freight', async () => {
    expect(
      await errorsFor({ dateMode: 'SCHEDULED', exactDatetime: 'amanhã' }),
    ).toContain('exactDatetime');
  });

  it('accepts a scheduled freight with a valid date', async () => {
    expect(
      await errorsFor({
        dateMode: 'SCHEDULED',
        exactDatetime: '2026-06-01T10:00:00Z',
      }),
    ).toEqual([]);
  });

  it('requires the window for a flexible freight', async () => {
    expect(await errorsFor({ dateMode: 'FLEXIBLE' })).toContain(
      'availabilityWindow',
    );
  });

  it('rejects an unknown window for a flexible freight', async () => {
    expect(
      await errorsFor({ dateMode: 'FLEXIBLE', availabilityWindow: 'NEVER' }),
    ).toContain('availabilityWindow');
  });

  it.each([
    'TODAY',
    'TOMORROW',
    'THIS_WEEK',
    'WEEKEND',
    'NEXT_WEEK',
    'ANY_DAY',
  ])('accepts the window %s', async (availabilityWindow) => {
    expect(
      await errorsFor({ dateMode: 'FLEXIBLE', availabilityWindow }),
    ).toEqual([]);
  });

  it('ignores the date and window when the mode does not use them', async () => {
    expect(
      await errorsFor({
        dateMode: 'IMMEDIATE',
        exactDatetime: 'lixo',
        availabilityWindow: 'lixo',
      }),
    ).toEqual([]);
  });
});
