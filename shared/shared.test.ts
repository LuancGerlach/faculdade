import { describe, expect, it } from 'vitest';
import { isValidCpf, onlyDigits } from './cpf.js';
import { calculateDiscountInCents } from './pricing.js';

describe('shared/cpf', () => {
  it('aceita CPF válido com e sem máscara', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('52998224725')).toBe(true);
  });

  it('rejeita dígito verificador errado, tamanho errado e números repetidos', () => {
    expect(isValidCpf('529.982.247-24')).toBe(false);
    expect(isValidCpf('123')).toBe(false);
    expect(isValidCpf('111.111.111-11')).toBe(false);
  });

  it('remove tudo que não é dígito', () => {
    expect(onlyDigits('529.982.247-25')).toBe('52998224725');
  });
});

describe('shared/pricing', () => {
  it('dá 5% no Pix', () => {
    expect(calculateDiscountInCents(10_000, 'PIX')).toBe(500);
  });

  it('não dá desconto no cartão e boleto sem cupom', () => {
    expect(calculateDiscountInCents(10_000, 'CARTAO')).toBe(0);
    expect(calculateDiscountInCents(10_000, 'BOLETO')).toBe(0);
  });

  it('soma cupom ao desconto do Pix', () => {
    expect(calculateDiscountInCents(10_000, 'PIX', 10)).toBe(1_500);
  });
});
