import React from 'react';
import cx from 'classnames';
import { SupportText } from './SupportText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: 'primary' | 'default';
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
};

export function Select({
  variant = 'default',
  label,
  helpText,
  error,
  disabled = false,
  value,
  defaultValue,
  children,
  className,
  ...rest
}: SelectProps) {
  const hasValue = (value != null && value !== '') || (defaultValue != null && defaultValue !== '');

  const variants: Record<NonNullable<SelectProps['variant']>, string> = {
    primary: 'border-white bg-white',
    default: 'border-light-blue-25 bg-light-blue-25',
  };

  return (
    <div className="w-full relative">
      {/* Label + select container */}
      <label
        className={cx(
          'relative flex items-center border-2 font-medium transition-colors duration-200 focus-within:border-primary-600',
          {
            'h-14': !!label,
            '!border-transparent bg-light-blue-300/20 cursor-not-allowed': disabled,
            'border-red-500 focus-within:border-red-500': !!error,
          },
          variants[variant],
          className,
        )}
      >
        {/* Label (text) */}
        {label && (
          <span
            className={cx(
              'absolute left-0 ml-2 text-xs font-normal transition-all pointer-events-none top-0 mt-1.5',
              {
                'text-light-blue-900': !hasValue && !disabled,
                'text-light-blue-600': hasValue || disabled,
              },
            )}
          >
            {label}
          </span>
        )}

        <select
          {...rest}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          className={cx(
            'h-full w-full appearance-none bg-transparent outline-none text-base font-medium',
            'text-light-blue-900 placeholder:text-light-blue-400 px-2 py-2 cursor-pointer',
            { 'px-2 pt-6 pb-1': label != null, 'text-light-blue-400 cursor-not-allowed': disabled },
          )}
        >
          {children}
        </select>

        <div className="pointer-events-none absolute right-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </label>

      {error && <SupportText intent="error">{error}</SupportText>}
      {helpText && !error && <SupportText intent="help">{helpText}</SupportText>}
    </div>
  );
}
