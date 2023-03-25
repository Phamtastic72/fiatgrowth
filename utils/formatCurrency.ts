const defaultOptions: Partial<Intl.NumberFormatOptions> = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
};

export default function formatCurrency(
  number: number,
  options: Exclude<Intl.NumberFormatOptions, 'style'> = {}
) {
  const formatter = new Intl.NumberFormat('en-US', {
    ...defaultOptions,
    ...options,
  });

  return formatter.format(number);
}
