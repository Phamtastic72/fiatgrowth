export default function ChartLegend({
  labelGrowth = 'Target',
  labelGrain = 'Projected',
}: {
  labelGrowth?: string;
  labelGrain?: string;
}) {
  return (
    <div className="flex items-center justify-center space-x-6">
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 rounded border border-matte bg-growth" />
        <div className="text-matte">{labelGrowth}</div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 rounded border border-matte bg-grain" />
        <div className="text-matte">{labelGrain}</div>
      </div>
    </div>
  );
}
