const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });

export const formatCurrency = (amount) => currencyFormatter.format(amount);
export const formatDate = (isoDate) => dateFormatter.format(new Date(isoDate));

export const productTypeLabel = { CURSO: 'Curso', EBOOK: 'E-book', PACOTE: 'Pacote' };
export const paymentMethodLabel = { PIX: 'Pix', CARTAO: 'Cartão', BOLETO: 'Boleto' };

export function formatCpf(rawValue) {
  const cpfDigits = rawValue.replace(/\D/g, '').slice(0, 11);
  return cpfDigits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
