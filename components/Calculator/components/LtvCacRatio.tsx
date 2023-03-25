import formatNumber from '../../../utils/formatNumber';
import Card from '../../Card/Card';
import LineChart, { LineChartProps } from '../../Chart/components/LineChart';
import ResultTitle from './ResultTitle';

export default function CalculatorLtvCacRatio({
  data,
}: {
  data: LineChartProps['data'];
}) {
  return (
    <Card align="left">
      <div>
        <ResultTitle
          title="LTV:CAC Ratio"
          result={formatNumber(data[data.length - 1].target)}
        />

        <div className="-mx-4 mt-4 -mb-4">
          <LineChart
            data={data}
            formatValue={formatNumber}
            includeZero={true}
          />
        </div>
      </div>
    </Card>
  );
}
