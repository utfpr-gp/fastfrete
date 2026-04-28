type PrismaModel = {
  findUnique: (args: { where: Record<string, unknown> }) => Promise<unknown>;
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
};

export interface SeedOptions<TData, TResult> {
  /**
   * Display name for logging (e.g., "users", "companies")
   */
  name: string;

  /**
   * Array of data to seed
   */
  data: TData[];

  /**
   * Function to get the unique identifier for checking existence
   * Return the "where" clause for findUnique
   * Example: (item) => ({ email: item.email })
   */
  getUniqueKey: (item: TData) => Record<string, unknown>;

  /**
   * The Prisma model to use (e.g., prisma.user)
   */
  model: PrismaModel;

  /**
   * Optional: Transform the created/found record to the result type
   * Default: returns the record as-is
   */
  toResult?: (record: unknown) => TResult;
}

export interface SeedResult<TResult> {
  items: TResult[];
  created: number;
  skipped: number;
}

/**
 * Generic seed helper that handles:
 * - Idempotent seeding (skip if exists)
 * - Consistent logging
 * - Counting created/skipped
 * - Returning results for use in relationships
 */
export async function seed<TData extends Record<string, unknown>, TResult = TData>(
  options: SeedOptions<TData, TResult>,
): Promise<SeedResult<TResult>> {
  const { name, data, getUniqueKey, model, toResult } = options;

  console.log(`🌱 Seeding ${name}...`);

  const items: TResult[] = [];
  let created = 0;
  let skipped = 0;

  for (const item of data) {
    const uniqueKey = getUniqueKey(item);
    const existing = await model.findUnique({ where: uniqueKey });

    if (existing) {
      skipped++;
      items.push(toResult ? toResult(existing) : (existing as TResult));
      continue;
    }

    const record = await model.create({ data: item });
    created++;
    items.push(toResult ? toResult(record) : (record as TResult));
  }

  console.log(`✅ ${capitalize(name)}: ${created} created, ${skipped} skipped`);

  return { items, created, skipped };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Simplified version for common case where unique key is a single field
 */
export async function seedByField<TData extends Record<string, unknown>, TResult = TData>(
  name: string,
  model: PrismaModel,
  data: TData[],
  uniqueField: keyof TData,
  toResult?: (record: unknown) => TResult,
): Promise<SeedResult<TResult>> {
  return seed({
    name,
    data,
    model,
    getUniqueKey: (item) => ({ [uniqueField]: item[uniqueField] }),
    toResult,
  });
}
