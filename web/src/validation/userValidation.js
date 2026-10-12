import { isValidCpf } from '../../../shared/cpf';

// Validação no cliente com JavaScript puro. As mesmas regras são revalidadas no back
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(name) {
  if (!name.trim()) return 'Informe seu nome';
  if (name.trim().length < 3) return 'Nome deve ter ao menos 3 caracteres';
  return null;
}

function validateEmail(email) {
  if (!email.trim()) return 'Informe seu e-mail';
  if (!EMAIL_PATTERN.test(email.trim())) return 'E-mail inválido';
  return null;
}

function validatePassword(password) {
  if (!password) return 'Informe uma senha';
  if (password.length < 8) return 'Senha deve ter ao menos 8 caracteres';
  if (!/\d/.test(password)) return 'Senha deve conter ao menos um número';
  if (!/[A-Za-z]/.test(password)) return 'Senha deve conter ao menos uma letra';
  return null;
}

function validateCpf(cpf) {
  if (!cpf) return 'Informe seu CPF';
  if (!isValidCpf(cpf)) return 'CPF inválido';
  return null;
}

function validateConfirmPassword(confirmPassword, password) {
  if (!confirmPassword) return 'Confirme sua senha';
  if (confirmPassword !== password) return 'As senhas não coincidem';
  return null;
}

// Remove os campos sem erro: objeto vazio = formulário válido
const keepErrors = (errorsByField) =>
  Object.fromEntries(Object.entries(errorsByField).filter(([, errorMessage]) => errorMessage));

export function validateRegister(formValues) {
  return keepErrors({
    name: validateName(formValues.name),
    email: validateEmail(formValues.email),
    cpf: validateCpf(formValues.cpf),
    password: validatePassword(formValues.password),
    confirmPassword: validateConfirmPassword(formValues.confirmPassword, formValues.password),
    acceptedTerms: formValues.acceptedTerms ? null : 'É necessário aceitar os termos de uso',
  });
}

export function validateLogin(formValues) {
  return keepErrors({
    email: validateEmail(formValues.email),
    password: formValues.password ? null : 'Informe sua senha',
  });
}

export function validateAccount(formValues) {
  return keepErrors({
    name: validateName(formValues.name),
    email: validateEmail(formValues.email),
  });
}
