import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.number({ error: 'Usuário obrigatório' }).int().positive(),
  productIds: z
    .array(z.number().int().positive())
    .min(1, 'O carrinho está vazio')
    .refine((productIds) => new Set(productIds).size === productIds.length, 'Produto duplicado no carrinho'),
  paymentMethod: z.enum(['PIX', 'CARTAO', 'BOLETO'], { error: 'Forma de pagamento inválida' }),
  couponCode: z.string().trim().toUpperCase().optional(),
});

export type CreateOrderRequestDto = z.infer<typeof createOrderSchema>;
