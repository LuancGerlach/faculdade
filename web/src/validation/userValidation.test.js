import { describe, expect, it } from 'vitest';
import { validateAccount, validateLogin, validateRegister } from './userValidation';

const validRegister = {
  name: 'João Silva',
  email: 'joao@email.com',
  cpf: '529.982.247-25',
  password: 'senha1234',
  confirmPassword: 'senha1234',
  acceptedTerms: true,
};

describe('validateRegister', () => {
  it('não retorna erros para dados válidos', () => {
    expect(validateRegister(validRegister)).toEqual({});
  });

  it('exige todos os campos obrigatórios', () => {
    const errors = validateRegister({ name: '', email: '', cpf: '', password: '', confirmPassword: '', acceptedTerms: false });
    expect(Object.keys(errors)).toEqual(['name', 'email', 'cpf', 'password', 'confirmPassword', 'acceptedTerms']);
  });

  it('valida formato de e-mail, CPF, força da senha e confirmação', () => {
    const errors = validateRegister({
      ...validRegister, email: 'joao@', cpf: '111.111.111-11', password: 'abcdefgh', confirmPassword: 'outra',
    });
    expect(errors).toEqual({
      email: 'E-mail inválido',
      cpf: 'CPF inválido',
      password: 'Senha deve conter ao menos um número',
      confirmPassword: 'As senhas não coincidem',
    });
  });
});

describe('validateLogin e validateAccount', () => {
  it('exige e-mail e senha no login', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({ email: 'Informe seu e-mail', password: 'Informe sua senha' });
  });

  it('valida nome curto na conta', () => {
    expect(validateAccount({ name: 'Jo', email: 'jo@email.com' })).toEqual({ name: 'Nome deve ter ao menos 3 caracteres' });
  });
});
