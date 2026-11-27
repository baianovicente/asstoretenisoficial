export const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const installments = (value: number, times = 12) =>
  formatBRL(value / times);
