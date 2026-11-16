export function formatStreetAddress(street: string, number: string, district: string): string {
  const streetWithNumber = number ? `${street}, ${number}` : street
  return `${streetWithNumber} - ${district}`
}

export function formatCityAddress(
  street: string,
  number: string,
  district: string,
  cityName: string,
  cityState: string
): string {
  return `${formatStreetAddress(street, number, district)}, ${cityName} - ${cityState}`
}
