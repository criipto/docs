import React from 'react';
import cx from 'classnames';
import { SupportText } from './SupportText';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: 'primary' | 'default';
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
};

export function Textarea({
  variant = 'default',
  label,
  helpText,
  error,
  disabled = false,
  className,
  value,
  ...rest
}: TextareaProps) {
  const variants: Record<NonNullable<TextareaProps['variant']>, string> = {
    primary: 'border-white bg-white',
    default: 'border-light-blue-25 bg-light-blue-25',
  };

  const hasValue = value != null && value !== '';

  return (
    <div className="w-full">
      <label
        className={cx(
          'relative flex flex-col px-2 pt-3 pb-2 font-medium transition-colors duration-200',
          'border-2 border-white focus-within:border-primary-600',
          {
            'border-transparent bg-light-blue-300/20': disabled,
            'border-red-500 focus-within:border-red-500': !!error,
          },
          className,
          variants[variant],
        )}
      >
        {label && (
          <span
            className={cx('text-xs font-normal leading-3 mb-2 pointer-events-none', {
              'text-light-blue-900': !hasValue && !disabled,
              'text-light-blue-600': hasValue || disabled,
            })}
          >
            {label}
          </span>
        )}

        <textarea
          {...rest}
          value={value}
          disabled={disabled}
          className={cx(
            'w-full resize-none bg-transparent outline-none border-none',
            'text-base font-medium leading-5 text-light-blue-900',
            'placeholder:text-light-blue-400',
            { 'text-light-blue-400': disabled },
          )}
        />
      </label>

      {error && <SupportText intent="error">{error}</SupportText>}
      {helpText && !error && <SupportText intent="help">{helpText}</SupportText>}
    </div>
  );
}
