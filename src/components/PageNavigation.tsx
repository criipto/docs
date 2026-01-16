import React, { useEffect, useState, useCallback } from 'react';
import cx from 'classnames';
import { IduraBanner } from './IduraBanner';

export interface PageNavigationItem {
  title: string;
  url: string;
  items?: PageNavigationItem[];
  onClick?: () => void;
}
interface PageNavigationProps {
  items: PageNavigationItem[];
  title?: string;
  onNavigate?: () => void;
  isEmbedded: boolean;
}

interface DesktopPageNavigationProps extends PageNavigationProps {
  isIduraBannerVisible?: boolean;
  onCloseBanner?: () => void;
}

export function PageNavigation(props: PageNavigationProps) {
  const { items, onNavigate } = props;
  const [active, setActive] = useState<PageNavigationItem | null>(null);

  const handleClick = (event: React.MouseEvent, item: PageNavigationItem) => {
    if (item.onClick) {
      event.preventDefault();
      item.onClick();
    }
    if (onNavigate) {
      onNavigate();
    }
  };

  const determineActive = useCallback(() => {
    const halfway = window.innerHeight / 2;
    let active: [PageNavigationItem, number] | null = null;

    items.forEach(item => {
      if (item.url?.startsWith('#')) {
        const element = document.querySelector(item.url)!;
        if (!element) return;

        const value = Math.abs(halfway - element.getBoundingClientRect().y);
        if (!active) {
          active = [item, value];
          return;
        }

        if (value < active[1]) {
          active = [item, value];
        }
      }
    });

    setActive(active ? active[0] : null);
  }, [items]);

  useEffect(() => {
    if (!items.length) return;
    const scrollListener = () => {
      determineActive();
    };
    determineActive();
    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, [items]);

  if (!items.length) return null;

  return (
    <React.Fragment>
      <h5 className="uppercase text-light-blue-600 font-semibold mb-4 text-md leading-6">
        {props.title || 'On this page'}{' '}
      </h5>
      <ul className="text-light-blue-900 text-md leading-6">
        {items.map(item => (
          <React.Fragment key={item.title}>
            <li key={item.title}>
              <a
                href={item.url}
                className={`group flex items-start block py-1 hover:font-bold ${active === item ? 'font-bold' : ''}`}
                onClick={event => handleClick(event, item)}
              >
                {item.title}
              </a>
            </li>
            {item.items?.map(sub => (
              <li key={sub.title} className={`ml-4`}>
                <a
                  href={sub.url}
                  className={`group flex items-start block py-1 hover:font-bold ${active === sub ? 'font-bold' : ''}`}
                  onClick={event => handleClick(event, sub)}
                >
                  <svg
                    width="3"
                    height="24"
                    viewBox="0 -9 3 24"
                    className="mr-2 overflow-visible group-hover:font-bold"
                  >
                    <path
                      d="M0 0L3 3L0 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                  {sub.title}
                </a>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </React.Fragment>
  );
}

export function DesktopPageNavigation(props: DesktopPageNavigationProps) {
  return (
    <div
      className={cx(
        'fixed z-20 bottom-0 w-[19.5rem] px-8 overflow-y-auto hidden xl:block',
        props.isEmbedded
          ? 'top-0 right-0'
          : 'top-[3.3125rem] right-[max(0px,calc(50%-768px))] py-10 mb-3',
      )}
    >
      <IduraBanner isVisible={props.isIduraBannerVisible} onClose={props.onCloseBanner} />
      <PageNavigation {...props} />
    </div>
  );
}
