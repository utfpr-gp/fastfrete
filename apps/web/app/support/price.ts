export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}

export function toSuggestedPrice(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === '') return null
  const value = Number(raw)
  return Number.isFinite(value) && value > 0 ? value : null
}
