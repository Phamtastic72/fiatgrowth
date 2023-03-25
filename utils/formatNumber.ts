const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function formatPercentage(value: number): string {
  return `${formatter.format(value)}`;
}
