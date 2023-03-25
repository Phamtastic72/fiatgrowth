export default function chunk<T>(allValues: T[], count: number) {
  const chunkSize = Math.ceil(allValues.length / count);
  const safeCount = Math.floor(allValues.length / chunkSize);

  const chunks: T[][] = [];

  for (let i = 0; i < safeCount; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, allValues.length) - 1;
    chunks.push(allValues.slice(start, end));
  }

  return chunks;
}
