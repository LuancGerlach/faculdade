// Valida CPF pelos dígitos verificadores (módulo 11)
export function isValidCpf(rawCpf: string): boolean {
  const cpfDigits = rawCpf.replace(/\D/g, '');
  if (cpfDigits.length !== 11 || /^(\d)\1{10}$/.test(cpfDigits)) return false;

  const calculateCheckDigit = (baseDigits: string) => {
    const weightedSum = baseDigits
      .split('')
      .reduce((sum, digit, position) => sum + Number(digit) * (baseDigits.length + 1 - position), 0);
    const remainder = (weightedSum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstCheckDigit = calculateCheckDigit(cpfDigits.slice(0, 9));
  const secondCheckDigit = calculateCheckDigit(cpfDigits.slice(0, 10));
  return firstCheckDigit === Number(cpfDigits[9]) && secondCheckDigit === Number(cpfDigits[10]);
}

export const onlyDigits = (value: string) => value.replace(/\D/g, '');
