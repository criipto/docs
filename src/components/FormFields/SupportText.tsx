import React, { ReactElement } from 'react';
import cx from 'classnames';

type SupportTextProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  intent: 'help' | 'error';
  children: React.ReactNode;
  disabled?: boolean;
};

export function SupportText(props: SupportTextProps): ReactElement {
  const { children, disabled = false, intent, className, onClick, ...rest } = props;

  return (
    <div
      {...rest}
      onClick={onClick}
      className={cx(
        'pt-1.5 text-sm font-normal leading-5 mb-1 not-prose support-text',
        {
          'cursor-pointer': onClick != null,
          'opacity-50': disabled,
          'text-light-blue-700': intent === 'help',
          'text-red-400': intent === 'error',
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
