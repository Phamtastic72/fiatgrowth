import CardTitle from '../../Card/components/CardTitle';

export default function ResultTitle({
  title,
  result = '',
}: {
  title: string;
  result?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <CardTitle>{title}</CardTitle>
      <span className="relative -top-0.5 font-sans text-3xl font-medium tabular-nums leading-none text-growth">
        {result}
      </span>
    </div>
  );
}
