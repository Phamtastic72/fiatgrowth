import { useCallback, useMemo, useState } from 'react';

import { Group } from '@visx/group';
import { ParentSizeModern } from '@visx/responsive';
import { scaleBand } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { Text } from '@visx/text';

import getLinearScaleForValues from '../../../utils/getLinearScaleForValues';
import { AxisBottom, Orientation } from '@visx/axis';
import chunk from '../../../utils/chunk';
import { DmSans } from '../../../utils/getDmSansFont';
import ChartLegend from './Legend';

const defaultFormatter = (value: number) => value.toString();

const noop = () => {
  // Do nothing
};

export type LineChartProps = {
  data: { group: string; baseline: number; target: number }[];
  formatValue?: (value: number) => string;
  onMouseOver?: (
    timestamp: string,
    xPos: number,
    yPos: { min: number; max: number; target: number; baseline: number }
  ) => void;
  onMouseLeave?: () => void;
  includeZero?: boolean;
  referenceValue?: number;
};

function ActualLineChart({
  width,
  height,
  data,
  formatValue = defaultFormatter,
  onMouseOver = noop,
  onMouseLeave = noop,
  includeZero = false,
  referenceValue,
}: { width: number; height: number } & LineChartProps) {
  const margin = useMemo(
    () =>
      ({
        top: 20,
        bottom: 30,
        left: 20,
        right: 20,
      } as const),
    []
  );

  const actualWidth = width - margin.left - margin.right;
  const actualHeight = height - margin.top - margin.bottom;

  const baseline = useMemo(
    () => data.map((d) => ({ date: d.group, value: d.baseline })),
    [data]
  );

  const target = useMemo(
    () => data.map((d) => ({ date: d.group, value: d.target })),
    [data]
  );

  const timestamps = useMemo(() => baseline.map((d) => d.date), [baseline]);
  const values = useMemo(
    () => [...baseline, ...target].map((d) => d.value),
    [baseline, target]
  );

  const getX = (d: (typeof baseline)[number]): string => d.date;
  const getY = (d: (typeof baseline)[number]): number => d.value;

  const xScale = useMemo(
    () =>
      scaleBand({
        domain: timestamps,
        paddingInner: 1,
        paddingOuter: 0,
        range: [0, actualWidth],
        align: 0,
        round: false,
      }),
    [timestamps, actualWidth]
  );

  const yScale = useMemo(
    () =>
      getLinearScaleForValues(values, [actualHeight, 0], { zero: includeZero }),
    [actualHeight, includeZero, values]
  );

  const xAxisProps = useMemo(() => {
    const tickWidth = 30;
    const allTickValues = xScale.domain();
    const maxTicks = Math.floor(actualWidth / tickWidth);

    const allowedTicks =
      maxTicks >= allTickValues.length
        ? allTickValues
        : chunk(allTickValues.slice(0, -1), maxTicks - 1).map((c) => c[0]);

    const tickValues = allTickValues.map((tick, i) => {
      if (allowedTicks.includes(tick)) {
        return tick;
      }

      if (i === allTickValues.length - 1) {
        return tick;
      }

      return '';
    });

    return {
      orientation: Orientation.bottom,
      hideAxisLine: true,
      hideTicks: true,
      hideZero: true,
      scale: xScale,
      tickLength: 0,
      tickFormat: (timestamp: string) => timestamp.split(' ')[0],
      tickLabelProps: () =>
        ({
          fill: '#272727',
          opacity: 0.6,
          fontSize: 12,
          fontFamily: `var(--${DmSans.variable}), sans-serif`,
          textAnchor: 'middle',
          dy: '0.5em',
        } as const),
      tickValues,
    };
  }, [actualWidth, xScale]);

  const valueTextProps = useMemo(() => {
    return {
      fill: '#272727',
      fontSize: 14,
      fontFamily: `var(--${DmSans.variable}), sans-serif`,
      fontWeight: 500,
      verticalAnchor: 'end' as const,
      dy: '-0.75em',
    };
  }, []);

  const setTooltip = useCallback(
    (timestamp: string) => {
      const index = timestamps.indexOf(timestamp);

      const yValues = {
        min: margin.top,
        max: actualHeight + margin.top,
        target: margin.top + yScale(target[index].value),
        baseline: margin.top + yScale(baseline[index].value),
      };

      onMouseOver(timestamp, margin.left + (xScale(timestamp) || 0), yValues);
    },
    [
      timestamps,
      margin.top,
      margin.left,
      actualHeight,
      yScale,
      target,
      baseline,
      onMouseOver,
      xScale,
    ]
  );

  return (
    <svg width={width} height={height} onMouseLeave={onMouseLeave}>
      <AxisBottom
        left={margin.left}
        top={actualHeight + margin.top}
        {...xAxisProps}
      />

      <Group top={margin.top} left={margin.left + xScale.bandwidth() / 2}>
        {timestamps.map((timestamp) => {
          const hoverZoneWidth = xScale.step();
          const hoverZoneX = (xScale(timestamp) || 0) - xScale.step() / 2;

          return (
            <rect
              key={timestamp}
              x={hoverZoneX}
              width={hoverZoneWidth}
              y={0}
              height={actualHeight}
              fill="transparent"
              onMouseOver={() => setTooltip(timestamp)}
            ></rect>
          );
        })}
      </Group>

      <Group top={margin.top} left={margin.left + xScale.bandwidth() / 2}>
        {typeof referenceValue === 'number' && (
          <LinePath
            curve={curveMonotoneX}
            data={target}
            x={(d) => xScale(getX(d)) ?? 0}
            y={yScale(referenceValue) ?? 0}
            className="stroke-matte"
            strokeWidth={5}
            strokeOpacity={0.06}
            strokeLinecap="round"
            shapeRendering="geometricPrecision"
            style={{ pointerEvents: 'none' }}
          />
        )}

        <LinePath
          curve={curveMonotoneX}
          data={baseline}
          x={(d) => xScale(getX(d)) ?? 0}
          y={(d) => yScale(getY(d)) ?? 0}
          className="stroke-grain"
          strokeWidth={5}
          strokeLinecap="round"
          shapeRendering="geometricPrecision"
          style={{ pointerEvents: 'none' }}
          strokeDasharray="10, 10"
        />

        <LinePath
          curve={curveMonotoneX}
          data={target}
          x={(d) => xScale(getX(d)) ?? 0}
          y={(d) => yScale(getY(d)) ?? 0}
          className="stroke-growth"
          strokeWidth={5}
          strokeLinecap="round"
          shapeRendering="geometricPrecision"
          style={{ pointerEvents: 'none' }}
        />
      </Group>

      <Group
        top={margin.top}
        left={margin.left + xScale.bandwidth() / 2}
        style={{ pointerEvents: 'none' }}
      >
        <Text
          {...valueTextProps}
          x={xScale(getX(baseline[0]))}
          y={yScale(getY(baseline[0]))}
          textAnchor="start"
        >
          {formatValue(baseline[0].value)}
        </Text>
        <Text
          {...valueTextProps}
          x={xScale(getX(baseline[baseline.length - 1]))}
          y={yScale(getY(baseline[baseline.length - 1]))}
          textAnchor="end"
        >
          {formatValue(baseline[baseline.length - 1].value)}
        </Text>
        <Text
          {...valueTextProps}
          x={xScale(getX(target[target.length - 1]))}
          y={yScale(getY(target[target.length - 1]))}
          textAnchor="end"
        >
          {formatValue(target[target.length - 1].value)}
        </Text>
        {typeof referenceValue === 'number' && (
          <Text
            {...valueTextProps}
            x={xScale(getX(target[0]))}
            y={yScale(referenceValue)}
            textAnchor="start"
          >
            {formatValue(referenceValue)}
          </Text>
        )}
      </Group>
    </svg>
  );
}

export default function LineChart({
  data,
  formatValue = defaultFormatter,
  ...props
}: LineChartProps) {
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const [tooltipTimestamp, setTooltipTimestamp] = useState<string | null>(null);
  const [tooltipYPos, setTooltipYPos] = useState<{
    min: number;
    max: number;
    target: number;
    baseline: number;
  } | null>(null);

  const tooltipValues = useMemo(() => {
    const activeValue = data.find(({ group }) => group === tooltipTimestamp);

    if (!activeValue) {
      return null;
    }

    return {
      target: formatValue(activeValue.target),
      baseline: formatValue(activeValue.baseline),
    };
  }, [data, formatValue, tooltipTimestamp]);

  return (
    <div>
      <div className="relative w-full">
        <div className="pb-[30%]"></div>
        {typeof tooltipTimestamp === 'string' && (
          <div
            className="pointer-events-none absolute z-10"
            style={{
              top: tooltipYPos?.min ?? 0,
              left: 0,
              right: 0,
              height: (tooltipYPos?.max ?? 0) - (tooltipYPos?.min ?? 0),
            }}
          >
            <div
              className="absolute left-0 h-full"
              style={{
                transform: `translateX(${tooltipLeft}px)`,
              }}
            >
              <div className="absolute top-0 bottom-0 w-px -translate-x-[0.5px] bg-gray-300"></div>
              <div
                className="absolute left-1/2 -translate-y-full -translate-x-1/2"
                style={{
                  top: (tooltipYPos?.target ?? 0) - (tooltipYPos?.min ?? 0),
                }}
              >
                <div className="rounded bg-white p-2 text-xs shadow-sm ring-1 ring-gray-700 ring-opacity-5">
                  <dl className="space-y-1">
                    <div className="flex gap-1">
                      <dt className="w-14 font-medium text-gray-700">Target</dt>
                      <dd className="font-medium tabular-nums text-growth">
                        {tooltipValues?.target}
                      </dd>
                    </div>
                    <div className="flex gap-1 opacity-70">
                      <dt className="w-14 font-medium text-gray-500">
                        Projected
                      </dt>
                      <dd className="font-medium tabular-nums text-growth">
                        {tooltipValues?.baseline}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0">
          <ParentSizeModern>
            {({ width, height }) => (
              <ActualLineChart
                width={width}
                height={height}
                data={data}
                formatValue={formatValue}
                {...props}
                onMouseLeave={() => setTooltipTimestamp(null)}
                onMouseOver={(timestamp, left, yPos) => {
                  setTooltipTimestamp(timestamp);
                  setTooltipLeft(left);
                  setTooltipYPos(yPos);
                }}
              />
            )}
          </ParentSizeModern>
        </div>
      </div>
      <div className="mt-4">
        <ChartLegend />
      </div>
    </div>
  );
}
