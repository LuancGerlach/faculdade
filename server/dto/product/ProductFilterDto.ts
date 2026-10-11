import { z } from 'zod';

const commaSeparatedList = z
  .string()
  .optional()
  .transform((rawValue) => (rawValue ? rawValue.split(',').map((item) => item.trim()).filter(Boolean) : undefined));

export const productFilterSchema = z.object({
  search: z.string().max(100).optional(),
  type: commaSeparatedList.pipe(z.array(z.enum(['CURSO', 'EBOOK', 'PACOTE'])).optional()),
  map: commaSeparatedList,
  maxPrice: z.coerce.number().positive('Preço máximo deve ser positivo').optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['mais-vendidos', 'menor-preco', 'maior-preco', 'avaliacao']).optional(),
});

export type ProductFilterDto = z.infer<typeof productFilterSchema>;
