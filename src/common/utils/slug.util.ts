export function generateSlug(input: string): string {
  return input
    .replace(/[ًٌٍَُِّْٰٓ‌ٔء،٫٬×\.\+\-_()$#^@#^@!~`]+/g, '')
    .replace(/[\s]+/g, '-');
}
