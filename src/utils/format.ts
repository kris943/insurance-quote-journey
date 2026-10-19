const currency = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 2,
});

const wholeCurrency = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount: number) => currency.format(amount);
export const formatWholeCurrency = (amount: number) => wholeCurrency.format(amount);
