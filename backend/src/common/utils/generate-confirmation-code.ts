export function generateConfirmationCode(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}
