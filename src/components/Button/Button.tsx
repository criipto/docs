import React from 'react';
import cx from 'classnames';

export type BaseButtonProps = {
  variant: 'primary' | 'default' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  working?: boolean;
  disabled?: boolean;
};

export type TextButtonProps = {
  iconLeft?: React.ReactNode;
  children: React.ReactNode;
};

export type IconButtonProps = {
  icon: React.ReactNode;
};

function getButtonClassName(props: BaseButtonProps & (TextButtonProps | IconButtonProps)) {
  const { size = 'md' } = props;
  const isDisabled = props.disabled || props.working;

  const base =
    'inline-flex box-border items-center justify-center gap-1.5 whitespace-nowrap px-4 shadow-sm font-medium text-sm font-sans !no-underline';

  const variants = {
    primary: cx('bg-primary-600 text-white', !isDisabled && 'hover:bg-primary-800'),
    default: cx(
      'border border-light-blue-700/30 text-light-blue-800 bg-transparent',
      !isDisabled && 'hover:bg-primary-600/10',
    ),
    dark: cx(
      'bg-transparent border border-white/40 text-white',
      !isDisabled && 'hover:bg-white/20',
    ),
  };

  const sizes = {
    sm: 'h-8 leading-4',
    md: 'h-10 leading-4',
    lg: 'h-12 leading-5 text-base',
  };

  const iconPadding = 'icon' in props ? 'px-2.5 py-2.5' : '';

  return cx(base, variants[props.variant], sizes[size], iconPadding, isDisabled && 'opacity-40');
}

function Inner(props: BaseButtonProps & (TextButtonProps | IconButtonProps)) {
  if ('icon' in props && props.icon != null) {
    return (
      <div className="flex w-5 justify-center">
        {props.working ? (
          <Spinner
            className={cx('h-5', props.variant === 'dark' ? 'text-white' : 'text-light-blue-800')}
          />
        ) : (
          <>{props.icon}</>
        )}
      </div>
    );
  }

  const iconLeft = props.working ? <Spinner /> : 'iconLeft' in props ? props.iconLeft : undefined;

  return (
    <>
      {iconLeft && <span className="h-4 flex items-center justify-center">{iconLeft}</span>}
      {'children' in props && props.children}
    </>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseButtonProps {}

export default function Button({
  working,
  ...props
}: ButtonProps & (TextButtonProps | IconButtonProps)) {
  const disabled = props.disabled || working;
  return (
    <button
      type={props.type ?? 'button'}
      {...props}
      disabled={disabled}
      className={cx(getButtonClassName({ ...props, working, disabled }), props.className)}
    >
      <Inner {...props} working={working} />
    </button>
  );
}

export interface AnchorButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    BaseButtonProps {}

export function AnchorButton({
  ...props
}: AnchorButtonProps & (TextButtonProps | IconButtonProps)) {
  return (
    <a
      {...props}
      rel="noopener noreferrer"
      className={cx(getButtonClassName(props), props.className)}
    >
      <Inner {...props} />
    </a>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cx('h-5 w-5 animate-spin-steps', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
    </svg>
  );
}
