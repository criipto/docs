import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';

type BaseButtonProps = {
  variant: 'primary' | 'default' | 'dark' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  working?: boolean;
  disabled?: boolean;
};

type TextButtonProps = {
  iconLeft?: React.ReactNode;
  children: React.ReactNode;
};

type IconButtonProps = {
  icon: React.ReactNode;
};

function getButtonClassName(props: BaseButtonProps & (TextButtonProps | IconButtonProps)) {
  const { size = 'md' } = props;
  const isDisabled = props.disabled || props.working;

  const base =
    'inline-flex box-border items-center justify-center gap-1.5 whitespace-nowrap px-4 shadow-sm font-medium text-sm font-sans !no-underline';

  const variants: Record<BaseButtonProps['variant'], string> = {
    primary: cx('bg-primary-600 text-white', { 'hover:bg-primary-800': !isDisabled }),
    default: cx('border border-light-blue-700/30 text-light-blue-800 bg-transparent', {
      'hover:bg-primary-600/10': !isDisabled,
    }),
    dark: cx('bg-transparent border border-white/40 text-white', {
      'hover:bg-white/20': !isDisabled,
    }),
    danger: cx('bg-red-400 text-white', { 'hover:bg-red-600': !isDisabled }),
  };

  const sizes: Record<NonNullable<BaseButtonProps['size']>, string> = {
    sm: 'h-8 leading-4',
    md: 'h-10 leading-4',
    lg: 'h-12 leading-5 text-base',
  };

  const iconPadding = 'icon' in props ? 'px-2.5 py-2.5' : '';

  return cx(base, variants[props.variant], sizes[size], iconPadding, isDisabled && 'opacity-40');
}

function ButtonContent(props: BaseButtonProps & (TextButtonProps | IconButtonProps)) {
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

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, BaseButtonProps {}

export function Button({ working, ...props }: ButtonProps & (TextButtonProps | IconButtonProps)) {
  const disabled = props.disabled || working;
  return (
    <button
      type={props.type ?? 'button'}
      {...props}
      disabled={disabled}
      className={cx(getButtonClassName({ ...props, working, disabled }), props.className)}
    >
      <ButtonContent {...props} working={working} />
    </button>
  );
}

interface AnchorButtonProps
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
      <ButtonContent {...props} />
    </a>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <FontAwesomeIcon
      icon={faSpinner}
      className={cx('h-5 w-5 animate-spin-steps', className)}
      fill="currentColor"
    />
  );
}
