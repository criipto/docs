import React, { ReactElement, ReactNode } from 'react';
import cx from 'classnames';

export type CardLinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  className?: string;
  top?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
};

export function CardLink(props: CardLinkProps): ReactElement {
  const { className, children, top, header, footer, ...rest } = props;

  return (
    <a
      {...rest}
      className={cx(
        'flex flex-col flex-1 justify-end border border-primary-600/30 bg-white text-left',
        'hover:cursor-pointer hover:bg-primary-25',
        'focus-visible:outline focus-visible:outline-primary-600',
        'active:bg-primary-50 no-underline not-prose',
        className,
      )}
    >
      {top}
      {/* Setting items-stretch because some browsers set align-items: start by default on flex elements */}
      <div className="relative flex flex-1 flex-col items-stretch justify-between pb-4 pl-6 pr-4 pt-5">
        <div className="mt-0 mb-4 h-10">{header}</div>
        <div
          className={cx('flex-1 text-sm text-light-blue-700', {
            'pt-0': header != null,
            'pb-6': footer != null,
          })}
        >
          {children}
        </div>
        {footer}
      </div>
    </a>
  );
}

type CardButtonTopProps = { children?: ReactNode };
export function CardButtonTop({ children }: CardButtonTopProps): ReactElement {
  return <div>{children}</div>;
}

type CardButtonHeaderProps = { children?: ReactNode; icon?: ReactNode };
export function CardButtonHeader({ icon, children }: CardButtonHeaderProps): ReactElement {
  // The header has a fixed height of 10 (40px), corresponding to two lines of text in the title,
  // to make content align across multiple adjacent cards (where one has a title of one line, and
  // the other one two)
  return (
    <div className="mb-4 flex h-10 items-center gap-2 text-light-blue-900">
      {icon && <div className="text-light-blue-800">{icon}</div>}
      <div className="text-base font-medium leading-abs-5 text-light-blue-900">{children}</div>
    </div>
  );
}

type CardButtonFooterProps = { children?: ReactNode };
export function CardButtonFooter({ children }: CardButtonFooterProps): ReactElement {
  return (
    <div className="flex items-center justify-between text-xs text-light-blue-500">{children}</div>
  );
}

CardLink.Top = CardButtonTop;
CardLink.Header = CardButtonHeader;
CardLink.Footer = CardButtonFooter;
