import React from 'react';
import { SupportText } from './SupportText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'primary' | 'default';
  label?: React.ReactNode;
  error?: React.ReactNode;
  helpText?: React.ReactNode;
};

export function InputField({
  variant = 'default',
  label,
  error,
  helpText,
  disabled,
  className,
  type = 'text',
  ...props
}: InputFieldProps) {
  const variants: Record<NonNullable<InputFieldProps['variant']>, string> = {
    primary: 'border-white bg-white',
    default: 'border-light-blue-25 bg-light-blue-25',
  };

  const hasValue = props.value != null && props.value !== '';

  return (
    <div className="w-full">
      <label
        className={cx(
          'flex flex-row items-center justify-between px-2 py-2.5 font-medium transition-colors duration-200',
          'border-2 mb-0 focus-within:border-primary-600',
          {
            'h-14': !!label,
            '!border-transparent bg-light-blue-300/20': disabled,
            'border-red-500 focus-within:border-red-500': !!error,
          },
          className,
          variants[variant],
        )}
      >
        <div className={cx('flex w-full flex-col justify-between h-full', { 'h-9 mt-1': !!label })}>
          {label && (
            <span
              className={cx('text-xs font-normal leading-3', {
                'text-light-blue-900': !hasValue && !disabled,
                'text-light-blue-600': hasValue || disabled,
              })}
            >
              {label}
            </span>
          )}

          <input
            type={type}
            disabled={disabled}
            className={cx(
              'w-full bg-transparent outline-none border-none p-0',
              'text-base font-medium leading-5 text-light-blue-900',
              'placeholder:text-light-blue-400',
              { 'text-light-blue-400': disabled },
            )}
            {...props}
          />
        </div>

        <div className="flex h-full items-center gap-2">
          {error && (
            <div className="flex justify-center">
              {error && (
                <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
      </label>

      {error && <SupportText intent="error">{error}</SupportText>}
      {helpText && !error && <SupportText intent="help">{helpText}</SupportText>}
    </div>
  );
}
