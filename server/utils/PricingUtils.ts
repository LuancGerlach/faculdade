export function generateOrderCode(): string {
  const randomDigits = Math.floor(10_000 + Math.random() * 90_000);
  return `CS2-${randomDigits}`;
}
