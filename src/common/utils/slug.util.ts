export function generateSlug(input: string, addRandomString: boolean): string {
  const cleanedInput = input
    .replace(/[ًٌٍَُِّْٰٓ‌ٔء،٫٬×\.\+\-_()$#^@#^@!~`]+/g, '')
    .replace(/[\s]+/g, '-');

  if (addRandomString) {
    const randomString = generateRandomString(16); // 16 characters random string
    return `${cleanedInput}-${randomString}`;
  } else {
    return cleanedInput;
  }
}

function generateRandomString(length: number): string {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
