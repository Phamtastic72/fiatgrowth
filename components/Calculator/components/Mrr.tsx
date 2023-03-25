import formatCurrency from '../../../utils/formatCurrency';
import Card from '../../Card/Card';
import LineChart, { LineChartProps } from '../../Chart/components/LineChart';
import ResultTitle from './ResultTitle';

export default function CalculatorMrr({
  data,
}: {
  data: LineChartProps['data'];
}) {
  return (
    <Card align="left">
      <div>
        <ResultTitle
          title="Monthly Recurring Revenue"
          result={formatCurrency(data[data.length - 1].target)}
        />

        <div className="-mx-4 mt-4 -mb-4">
          <LineChart data={data} formatValue={formatCurrency} />
        </div>
      </div>
    </Card>
  );
}
