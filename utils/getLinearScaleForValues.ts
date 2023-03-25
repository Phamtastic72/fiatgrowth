import { LinearScaleConfig, scaleLinear } from '@visx/scale';

const defaultScaleConfig = {
  zero: true,
  nice: true,
};

export default function getLinearScaleForValues(
  values: number[],
  range: [number, number],
  scaleConfig: Omit<LinearScaleConfig, 'domain' | 'range' | 'type'> = {}
) {
  const parsedScaleConfig = {
    ...defaultScaleConfig,
    ...scaleConfig,
  };

  const domain = [Math.min(...values), Math.max(...values)].map((v) =>
    Number.isNaN(v) || v === Infinity ? 0 : v
  );

  const precisionRange = domain.map((n) =>
    n === 0 ? 0 : Math.floor(Math.log10(Math.abs(n)))
  );

  const niceDomain = domain.map((n, i) => {
    const precision = precisionRange[i] - 1;
    const factor = Math.pow(10, precision);
    return Math[i === 0 ? 'floor' : 'ceil'](n / factor) * factor;
  });

  return scaleLinear({
    domain: niceDomain,
    range,
    ...parsedScaleConfig,
  });
}
