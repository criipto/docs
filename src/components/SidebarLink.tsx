import React from 'react';
import { Link, GatsbyLinkProps } from 'gatsby';
import cx from 'classnames';

export const SidebarLink = ({
  to,
  children,
  className,
  onClick,
  ...props
}: Omit<GatsbyLinkProps<any>, 'ref'>) => (
  <Link
    to={to}
    onClick={onClick}
    getProps={({ isCurrent }) => ({
      className: cx(
        'block border-l pl-4 py-1 lg:py-0 -ml-px border-transparent transition-colors',
        isCurrent
          ? 'text-light-blue-900 border-current font-medium'
          : 'text-primary-600 hover:text-light-blue-900 hover:border-light-blue-300/40 hover:font-medium',
        className,
      ),
    })}
    {...props}
  >
    {children}
  </Link>
);
