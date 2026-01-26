import React, { ReactNode, useEffect, useRef } from 'react';
import cx from 'classnames';
import { SupportText } from '../SupportText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import * as styles from './Checkbox.module.css';

type BaseCheckboxProps = {
  name: string;
  label: ReactNode;
  indeterminate?: boolean;
  className?: string;
  variant?: 'primary' | 'default';
  helpText?: React.ReactNode;
  error?: React.ReactNode;
};

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    BaseCheckboxProps {
  name: string;
}

export function Checkbox(props: CheckboxProps) {
  const {
    variant = 'default',
    name,
    label,
    helpText,
    error,
    className,
    id,
    disabled,
    indeterminate,
    ...rest
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  const variants: Record<NonNullable<CheckboxProps['variant']>, string> = {
    primary: 'border border-light-blue-700/40',
    default: '',
  };

  return (
    <div
      className={cx(
        'inline-flex items-center w-fit bg-transparent cursor-pointer group m-0',
        {
          'cursor-not-allowed opacity-60 hover:bg-transparent': disabled,
        },
        className,
        variants[variant],
      )}
    >
      <div className="grid grid-cols-[auto_1fr] items-start gap-x-2">
        <label className={cx('contents', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
          {/* Native input */}
          <input
            id={id}
            name={name}
            type="checkbox"
            disabled={disabled}
            className="peer sr-only"
            ref={inputRef}
            {...rest}
          />
          {/* Visible checkbox */}
          <div
            className={cx(
              styles.checkboxBox,
              'relative grid place-content-center shrink-0',
              // Transparent border creates space for the hover effect
              'border-8 border-transparent p-2',
              { 'group-hover:border-primary-600/05 group-hover:bg-primary-600/10': !disabled },
              'h-4 w-4',

              // Always visible inner border
              'shadow-[inset_0_0_0_2px_theme(colors.light-blue.500)]',
              'peer-indeterminate:shadow-[inset_0_0_0_2px_theme(colors.primary.600)]',
              { 'shadow-[inset_0_0_0_2px_theme(colors.red.400)]': error },

              // Before: purple filled square
              "before:content-[''] before:block before:scale-0 before:transition-transform",
              'before:h-2.5 before:w-2.5',
              'peer-checked:before:scale-150',
              {
                'before:bg-red-400 peer-checked:shadow-[inset_0_0_0_2px_theme(colors.red.400)]':
                  error,
                'before:bg-primary-600 peer-checked:shadow-[inset_0_0_0_2px_theme(colors.primary.600)]':
                  !error,
              },
            )}
            aria-hidden="true"
          />

          <div className="mr-3">
            <div className="inline-flex items-start gap-2">
              <div
                className={cx('leading-4.5 text-md font-medium tracking-normal translate-y-[1px]', {
                  'text-red-400': error,
                })}
              >
                {label}
              </div>

              {error && (
                <FontAwesomeIcon icon={faExclamationCircle} className="h-4 w-4 text-red-400" />
              )}
            </div>

            {(error || helpText) && (
              <div className="mt-1">
                {error && (
                  <SupportText intent="error" className="pt-0">
                    {error}
                  </SupportText>
                )}
                {helpText && (
                  <SupportText intent="help" className="pt-0">
                    {helpText}
                  </SupportText>
                )}
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
