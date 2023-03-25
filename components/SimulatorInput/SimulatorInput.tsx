import { useCallback } from 'react';
import classNames from '../../utils/classNames';

const noop = () => {
  // Do nothing
};

export default function SimulatorInput({
  id,
  label,
  value,
  onChange,
  targetValue,
  onTargetValueChange = noop,
  suffix = '',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  targetValue?: string;
  onTargetValueChange?: (newValue: string) => void;
  suffix?: string;
}) {
  const wrappedOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const wrappedOnTargetValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onTargetValueChange(e.target.value);
    },
    [onTargetValueChange]
  );

  return (
    <div className="flex flex-col space-y-1.5 text-left">
      <label htmlFor={id} className="flex-none truncate font-medium">
        {label}
      </label>
      <div className="flex w-full flex-col justify-items-stretch gap-3 sm:flex-row md:flex-col lg:flex-row">
        <label
          htmlFor={id}
          className={classNames(
            'flex w-full flex-1 items-center justify-items-stretch rounded-full border border-matte focus-within:border-growth focus-within:ring-2 focus-within:ring-grain'
          )}
        >
          <span className="flex h-10 w-[82px] items-center rounded-l-full bg-matte px-3 font-medium text-white">
            Current
          </span>
          <input
            type="text"
            value={value}
            onChange={wrappedOnChange}
            className={classNames(
              'w-0 flex-1 rounded-full bg-transparent pl-3 text-right tabular-nums focus:outline-none',
              suffix ? 'pr-1' : 'pr-3'
            )}
            id={id}
          />
          {suffix && (
            <span className="flex items-center pr-3 leading-none text-matte/40 md:block">
              {suffix}
            </span>
          )}
        </label>
        {typeof targetValue !== 'undefined' && (
          <label
            htmlFor={`${id}-target`}
            className="flex w-full flex-1 items-center justify-items-stretch rounded-full border border-matte  focus-within:border-growth focus-within:ring-2 focus-within:ring-grain"
          >
            <span className="flex h-10 w-[82px] items-center rounded-l-full bg-matte px-3 font-medium text-white">
              Target
            </span>

            <input
              type="text"
              value={targetValue}
              onChange={wrappedOnTargetValueChange}
              className={classNames(
                'w-0 flex-1 rounded-full bg-transparent pl-3 text-right tabular-nums focus:outline-none',
                suffix ? 'pr-1' : 'pr-3'
              )}
              id={`${id}-target`}
            />
            {suffix && (
              <span className="flex items-center pr-3 leading-none text-matte/40">
                {suffix}
              </span>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
