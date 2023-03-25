import Card from '../../Card/Card';
import StackedBarChart, {
  StackedBarChartProps,
} from '../../Chart/components/StackedBarChart';
import ResultTitle from './ResultTitle';

export default function CalculatorCustomerAcquisitionImpact({
  data,
}: StackedBarChartProps) {
  return (
    <Card align="left">
      <div>
        <ResultTitle title="Impact on Customer Acquisition" />
        <div className="-mx-4 mt-4 -mb-4">
          <StackedBarChart data={data} />
        </div>
      </div>
    </Card>
  );
}
