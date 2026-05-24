export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
