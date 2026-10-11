import { z } from 'zod';

// Mesmas regras do back (server/dto/user/UserRequestDto.ts): validação no cliente + no servidor
function isValidCpf(rawCpf) {
  const cpfDigits = rawCpf.replace(/\D/g, '');
  if (cpfDigits.length !== 11 || /^(\d)\1{10}$/.test(cpfDigits)) return false;
  const calculateCheckDigit = (baseDigits) => {
    const weightedSum = baseDigits.split('').reduce(
      (sum, digit, position) => sum + Number(digit) * (baseDigits.length + 1 - position), 0,
    );
    const remainder = (weightedSum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return calculateCheckDigit(cpfDigits.slice(0, 9)) === Number(cpfDigits[9])
    && calculateCheckDigit(cpfDigits.slice(0, 10)) === Number(cpfDigits[10]);
}

const nameField = z.string().trim().min(1, 'Informe seu nome').min(3, 'Nome deve ter ao menos 3 caracteres');
const emailField = z.string().trim().min(1, 'Informe seu e-mail').email('E-mail inválido');

export const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    cpf: z.string().min(1, 'Informe seu CPF').refine(isValidCpf, 'CPF inválido'),
    password: z
      .string()
      .min(1, 'Informe uma senha')
      .min(8, 'Senha deve ter ao menos 8 caracteres')
      .regex(/\d/, 'Senha deve conter ao menos um número')
      .regex(/[A-Za-z]/, 'Senha deve conter ao menos uma letra'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
    acceptedTerms: z.boolean().refine((accepted) => accepted, 'É necessário aceitar os termos de uso'),
  })
  .refine((formValues) => formValues.password === formValues.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Informe sua senha'),
});

export const accountSchema = z.object({
  name: nameField,
  email: emailField,
});
