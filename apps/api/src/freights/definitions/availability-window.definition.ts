export const AVAILABILITY_WINDOWS = [
  'TODAY',
  'TOMORROW',
  'THIS_WEEK',
  'WEEKEND',
  'NEXT_WEEK',
  'ANY_DAY',
] as const;

export type AvailabilityWindow = (typeof AVAILABILITY_WINDOWS)[number];
