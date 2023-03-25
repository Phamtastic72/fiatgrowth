import { useCallback, useMemo, useState } from 'react';

import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear } from '@visx/scale';
import { BarStack } from '@visx/shape';

import { AxisBottom, Orientation } from '@visx/axis';
import chunk from '../../../utils/chunk';
import { DmSans } from '../../../utils/getDmSansFont';
import ChartLegend from './Legend';
import { CalculateOutput } from '../../../pages/api/calculate';

export type StackedBarChartProps = {
  data: CalculateOutput['acquisition'];
  onMouseOver?: (
    timestamp: string,
    xPos: number,
    yPos: { min: number; max: number; trials: number; customers: number }
  ) => void;
  onMouseLeave?: () => void;
};

const noop = () => {
  // Do nothing
};

function ActualStackedBarChart({
  width,
  height,
  data,
  onMouseOver = noop,
  onMouseLeave = noop,
}: { width: number; height: number } & StackedBarChartProps) {
  const margin = useMemo(
    () =>
      ({
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      } as const),
    []
  );

  const actualWidth = width - margin.left - margin.right;
  const actualHeight = height - margin.top - margin.bottom;

  const timestamps = useMemo(() => data.map((d) => d.group), [data]);
  const keys = ['trials', 'customers'];

  const xScale = useMemo(
    () =>
      scaleBand({
        domain: timestamps,
        paddingInner: 0.33,
        paddingOuter: 0,
        range: [0, actualWidth],
        align: 0,
        round: false,
      }),
    [timestamps, actualWidth]
  );

  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.trials + d.customers)),
    [data]
  );

  const yScale = scaleLinear<number>({
    range: [actualHeight, 0],
    domain: [0, maxValue],
    round: true,
  });

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
          dy: '0.33em',
        } as const),
      tickValues,
    };
  }, [actualWidth, xScale]);

  const setTooltip = useCallback(
    (timestamp: string) => {
      const index = timestamps.indexOf(timestamp);

      const yValues = {
        min: margin.top,
        max: actualHeight + margin.top,
        customers: margin.top + yScale(data[index].customers),
        trials: margin.top + yScale(data[index].trials),
      };

      onMouseOver(
        timestamp,
        margin.left + (xScale(timestamp) || 0) + xScale.bandwidth() / 2,
        yValues
      );
    },
    [
      timestamps,
      margin.top,
      margin.left,
      actualHeight,
      yScale,
      data,
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
          const hoverZoneX = (xScale(timestamp) || 0) - hoverZoneWidth / 2;

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

      <Group top={margin.top} left={margin.left}>
        <BarStack
          keys={keys}
          data={data}
          x={(d) => d.group}
          xScale={xScale}
          yScale={yScale}
          color={(key) => (key === 'customers' ? '#DDFAAB' : '#9EC778')}
        >
          {(barStacks) => (
            <>
              {barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                  />
                ))
              )}
            </>
          )}
        </BarStack>
      </Group>
    </svg>
  );
}

export default function StackedBarChart({
  data,
  ...props
}: StackedBarChartProps) {
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const [tooltipTimestamp, setTooltipTimestamp] = useState<string | null>(null);
  const [tooltipYPos, setTooltipYPos] = useState<{
    min: number;
    max: number;
    trials: number;
    customers: number;
  } | null>(null);

  const tooltipValues = useMemo(() => {
    const activeValue = data.find(({ group }) => group === tooltipTimestamp);

    if (!activeValue) {
      return null;
    }

    return {
      trials: Math.round(activeValue.trials),
      customers: Math.round(activeValue.customers),
    };
  }, [data, tooltipTimestamp]);

  return (
    <div>
      <div className="relative w-full">
        <div className="pb-[35%]"></div>
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
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
                <div className="rounded bg-white p-2 text-xs shadow-sm ring-1 ring-gray-700 ring-opacity-5">
                  <dl className="space-y-1">
                    <div className="flex gap-1">
                      <dt className="w-20 font-medium text-gray-700">
                        Customers
                      </dt>
                      <dd className="font-medium tabular-nums text-growth">
                        {tooltipValues?.customers}
                      </dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="w-20 font-medium text-gray-700">Leads</dt>
                      <dd className="font-medium tabular-nums text-growth">
                        {tooltipValues?.trials}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0">
          <ParentSize>
            {({ width, height }) => (
              <ActualStackedBarChart
                width={width}
                height={height}
                data={data}
                onMouseLeave={() => setTooltipTimestamp(null)}
                onMouseOver={(timestamp, left, yPos) => {
                  setTooltipTimestamp(timestamp);
                  setTooltipLeft(left);
                  setTooltipYPos(yPos);
                }}
                {...props}
              />
            )}
          </ParentSize>
        </div>
      </div>
      <div className="mt-4">
        <ChartLegend labelGrowth="Qualified leads" labelGrain="New customers" />
      </div>
    </div>
  );
}
