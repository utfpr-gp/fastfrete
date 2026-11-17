export function toApiPhone(maskedPhone: string): string {
  return '+55' + maskedPhone.replaceAll('-', '').replaceAll(' ', '').trim()
}

export function fromApiPhone(apiPhone: string): string {
  const digits = apiPhone.replace(/\D/g, '').replace(/^55/, '')
  if (digits.length !== 11) return digits
  return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7)}`
}
