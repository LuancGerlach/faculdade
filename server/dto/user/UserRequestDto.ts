import { z } from 'zod';
import { isValidCpf, onlyDigits } from '../../utils/CpfValidatorUtils.js';

const nameField = z.string().trim().min(3, 'Nome deve ter ao menos 3 caracteres').max(120, 'Nome muito longo');
const emailField = z.string().trim().toLowerCase().email('E-mail inválido');
const cpfField = z
  .string()
  .transform(onlyDigits)
  .refine(isValidCpf, 'CPF inválido');
const passwordField = z
  .string()
  .min(8, 'Senha deve ter ao menos 8 caracteres')
  .regex(/\d/, 'Senha deve conter ao menos um número')
  .regex(/[A-Za-z]/, 'Senha deve conter ao menos uma letra');

// Equivalente a um DTO com @NotBlank, @Email, @Size... validado por @Valid
export const createUserSchema = z
  .object({
    name: nameField,
    email: emailField,
    cpf: cpfField,
    password: passwordField,
    confirmPassword: z.string(),
    acceptedTerms: z.literal(true, { error: 'É necessário aceitar os termos de uso' }),
  })
  .refine((userRequest) => userRequest.password === userRequest.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

// CPF é imutável após o cadastro
export const updateUserSchema = z.object({
  name: nameField,
  email: emailField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Informe a senha'),
});

export type CreateUserRequestDto = z.infer<typeof createUserSchema>;
export type UpdateUserRequestDto = z.infer<typeof updateUserSchema>;
export type LoginRequestDto = z.infer<typeof loginSchema>;
