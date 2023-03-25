export default function calculatePercentageDifference(
  from: number,
  to: number
): number {
  return (Math.abs(from - to) / ((from + to) / 2)) * 100;
}
