import React, { ReactElement } from 'react';
import cx from 'classnames';

export type LogoCardProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  className?: string;
  logoSrc: string;
  logoWidth?: number;
  logoHeight?: number;
  children: string;
};

export function LogoCard(props: LogoCardProps): ReactElement {
  const { className, logoSrc, logoWidth = 40, logoHeight = 40, children, ...rest } = props;

  return (
    <a
      {...rest}
      className={cx(
        'group block bg-white text-center no-underline shadow-sm transition-all duration-200',
        'border border-primary-600/30',
        'hover:cursor-pointer hover:border-primary-600/50 hover:shadow-md hover:ring-1 hover:ring-primary-600/50',
        'active:border-primary-600/50 active:ring-1 active:ring-primary-600/50',
        className,
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-between p-4">
        <div className="flex flex-1 items-center justify-center">
          <img src={logoSrc} width={logoWidth} height={logoHeight} alt="" />
        </div>

        <span className="mt-2 text-sm font-semibold leading-abs-4 text-primary-600">
          {children}
        </span>
      </div>
    </a>
  );
}
