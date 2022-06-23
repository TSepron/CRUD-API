export function isUuid(str: string) {
  const pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

  return pattern.test(str)
}