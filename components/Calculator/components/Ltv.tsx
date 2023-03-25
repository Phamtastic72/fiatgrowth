import { useMemo } from 'react';
import { CalculateOutput } from '../../../pages/api/calculate';
import calculatePercentageDifference from '../../../utils/calculatePercentageDifference';
import formatCurrency from '../../../utils/formatCurrency';
import formatPercentage from '../../../utils/formatPercentage';
import Card from '../../Card/Card';
import ResultTitle from './ResultTitle';

export default function CalculatorLtv({ from, to }: CalculateOutput['ltv']) {
  const percentageDifference = useMemo(
    () => calculatePercentageDifference(from, to),
    [from, to]
  );

  const movement = from > to ? 'Down' : 'Up';

  return (
    <Card align="left">
      <div>
        <ResultTitle title="LTV" result={formatCurrency(to)} />
        <div className="font-sans text-matte/60">
          {movement} {formatPercentage(percentageDifference)} from{' '}
          {formatCurrency(from)}
        </div>
      </div>
    </Card>
  );
}
