// Regra única de CPF, usada pelo back (DTO) e pelo front (formulário)
export const onlyDigits = (value: string) => value.replace(/\D/g, '');

export function isValidCpf(rawCpf: string): boolean {
  const cpfDigits = onlyDigits(rawCpf);
  if (cpfDigits.length !== 11 || /^(\d)\1{10}$/.test(cpfDigits)) return false;

  const calculateCheckDigit = (baseDigits: string) => {
    const weightedSum = baseDigits
      .split('')
      .reduce((sum, digit, position) => sum + Number(digit) * (baseDigits.length + 1 - position), 0);
    const remainder = (weightedSum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calculateCheckDigit(cpfDigits.slice(0, 9)) === Number(cpfDigits[9]) &&
    calculateCheckDigit(cpfDigits.slice(0, 10)) === Number(cpfDigits[10])
  );
}
