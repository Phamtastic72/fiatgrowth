import { useCallback, useEffect, useState } from 'react';

import { parseHumanReadableNumber } from '@usesummit/utils';

import {
  CalculateOutput,
  CalculateParameters,
} from '../../../pages/api/calculate';

import Button from '../../Button/Button';
import Card from '../../Card/Card';
import CardTitle from '../../Card/components/CardTitle';
import SimulatorInput from '../../SimulatorInput/SimulatorInput';

const ensureValidParameter = (value: string) => {
  try {
    return parseHumanReadableNumber(value.trim());
  } catch (e) {
    return null;
  }
};

export default function CalculatorInputs({
  onRun,
}: {
  onRun: (output: CalculateOutput) => void;
}) {
  const [mrr, setMrr] = useState('50k');
  const [spend, setSpend] = useState('12,000');

  const [monthlyVisitors, setMonthlyVisitors] = useState('3,000');
  const [monthlyVisitorsTarget, setMonthlyVisitorsTarget] = useState('4,500');
  const [signUpRate, setSignUpRate] = useState('3');
  const [signupRateTarget, setSignupRateTarget] = useState('5');
  const [conversionRate, setConversionRate] = useState('25');
  const [conversionRateTarget, setConversionRateTarget] = useState('26');
  const [arpc, setArpc] = useState('145');
  const [arpcTarget, setArpcTarget] = useState('145');
  const [churnRate, setChurnRate] = useState('7');
  const [churnRateTarget, setChurnRateTarget] = useState('3.5');

  const calculate = useCallback(() => {
    const parameters: CalculateParameters = {
      mrr: ensureValidParameter(mrr),
      media_spend: ensureValidParameter(spend),
      uniques_month: ensureValidParameter(monthlyVisitors),
      uniques_max: ensureValidParameter(monthlyVisitorsTarget),
      signup_rate: ensureValidParameter(signUpRate),
      max_signup_rate: ensureValidParameter(signupRateTarget),
      conversion_rate: ensureValidParameter(conversionRate),
      max_conversion_rate: ensureValidParameter(conversionRateTarget),
      arpc: ensureValidParameter(arpc),
      max_arpc: ensureValidParameter(arpcTarget),
      churn_rate: ensureValidParameter(churnRate),
      max_churn_rate: ensureValidParameter(churnRateTarget),
    };

    fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    })
      .then((response) => response.json())
      .then((data) => onRun(data as CalculateOutput));
  }, [
    mrr,
    spend,
    monthlyVisitors,
    monthlyVisitorsTarget,
    signUpRate,
    signupRateTarget,
    conversionRate,
    conversionRateTarget,
    arpc,
    arpcTarget,
    churnRate,
    churnRateTarget,
    onRun,
  ]);

  const onSubmit: React.FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      calculate();
    },
    [calculate]
  );

  useEffect(() => {
    calculate();
    // We use this `useEffect` with an empty dependency array
    // to run the calculation once on load with the initial values
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title="Actuals" variant="warmth" className="h-full w-full">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="mx-auto max-w-lg space-y-6">
          <SimulatorInput
            label="Monthly Recurring Revenue"
            value={mrr}
            onChange={setMrr}
            id="mrr"
            suffix="$"
          />

          <SimulatorInput
            label="Monthly Media Spend"
            value={spend}
            onChange={setSpend}
            id="monthly-spend"
            suffix="$"
          />
        </div>

        <CardTitle>Growth Targets</CardTitle>

        <div className="mx-auto max-w-lg space-y-6">
          <SimulatorInput
            label="Monthly Unique Visitors"
            value={monthlyVisitors}
            onChange={setMonthlyVisitors}
            targetValue={monthlyVisitorsTarget}
            onTargetValueChange={setMonthlyVisitorsTarget}
            id="monthly-visitors"
          />

          <SimulatorInput
            label="Visitor → Lead Conversion Rate"
            value={signUpRate}
            onChange={setSignUpRate}
            targetValue={signupRateTarget}
            onTargetValueChange={setSignupRateTarget}
            id="sign-up-rate"
            suffix="%"
          />

          <SimulatorInput
            label="Lead → Customer Conversion Rate"
            value={conversionRate}
            onChange={setConversionRate}
            targetValue={conversionRateTarget}
            onTargetValueChange={setConversionRateTarget}
            id="conversion-rate"
            suffix="%"
          />

          <SimulatorInput
            label="Average Revenue Per Customer"
            value={arpc}
            onChange={setArpc}
            targetValue={arpcTarget}
            onTargetValueChange={setArpcTarget}
            id="arpc"
            suffix="$"
          />

          <SimulatorInput
            label="Churn Rate"
            value={churnRate}
            onChange={setChurnRate}
            targetValue={churnRateTarget}
            onTargetValueChange={setChurnRateTarget}
            id="churn-rate"
            suffix="%"
          />
        </div>

        <div className="mx-auto flex w-60 flex-col space-y-4">
          <Button type="submit">Simulate</Button>
        </div>
      </form>
    </Card>
  );
}
