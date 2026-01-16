import React, { useLayoutEffect } from 'react';
import cx from 'classnames';

import { DesktopNavigation, MobileNavigation } from '../components/Navigation';
import Header from '../components/Header';
import { PageNavigationItem } from '../components/PageNavigation';
import { Link } from 'gatsby';
import { IduraBanner } from '../components/IduraBanner';

function upperFirst(input: string) {
  if (!input) return input;
  return input.substr(0, 1).toUpperCase() + input.substr(1);
}

export default function DefaultLayout(props: {
  children: React.ReactNode;
  location: Location;
  pageContext: any;
  pageNavigationItems?: PageNavigationItem[];
  isIduraBannerVisible: boolean;
  onCloseBanner: () => void;
}) {
  const { frontmatter } = props.pageContext;
  const description = frontmatter?.description || frontmatter?.subtitle;
  const suffix =
    frontmatter?.title === 'Idura Documentation'
      ? ''
      : frontmatter?.product
        ? ` - Idura ${upperFirst(frontmatter.product)} Documentation`
        : ' - Idura Documentation';

  const isEmbedded = props.pageContext?.isEmbedded;
  const category = frontmatter?.category ? ` - ${frontmatter.category}` : '';
  const title = frontmatter?.title + category + suffix;

  useLayoutEffect(() => {
    if (!isEmbedded) return;
    if (!window || !window.parent) return;

    window.parent.postMessage(`height:${document.body.offsetHeight}`, '*');
  }, [isEmbedded]);

  const breadcrumb = props.location.pathname.startsWith('/verify/articles')
    ? { href: '/verify/articles', label: 'Articles' }
    : props.location.pathname.startsWith('/signatures/articles')
      ? { href: '/signatures/articles', label: 'Articles' }
      : props.location.pathname.startsWith('/verify/reference/errors')
        ? { href: '/verify/reference/errors', label: 'Errors' }
        : null;

  return (
    <div>
      {/** todo: fix, use Gatsby replacement for helmet */}
      <head>
        <meta charSet="utf-8" />
        {title && <title>{title}</title>}
        <link rel="canonical" href={`https://docs.idura.app${props.location.pathname}`} />
        {description && <meta name="description" content={description} />}
      </head>
      <Header path={props.location.pathname} className={isEmbedded ? 'hidden' : ''} />
      <MobileNavigation
        key="mobileNav"
        path={props.location.pathname}
        frontmatter={frontmatter}
        pageNavigationItems={props.pageNavigationItems}
        isEmbedded={isEmbedded}
      />
      <div
        className={cx({
          'px-4 sm:px-6 md:px-8': !isEmbedded,
        })}
        key="content"
      >
        <div
          className={cx({
            'mx-auto max-w-screen-2xl pt-5 lg:pt-10 lg:pl-[22rem] xl:pr-[22rem]': !isEmbedded,
          })}
        >
          <DesktopNavigation key="desktopNav" path={props.location.pathname} hidden={isEmbedded} />
          <a id="overview" />
          <IduraBanner
            onClose={props.onCloseBanner}
            isVisible={props.isIduraBannerVisible}
            className="xl:hidden"
          />
          {frontmatter && (
            <header id="header" className="relative z-20 mb-8">
              <div>
                {!isEmbedded && frontmatter.category && (
                  <p className="mb-2 text-lg leading-6 font-sans font-semibold text-light-blue-600 uppercase">
                    {breadcrumb ? (
                      <React.Fragment>
                        <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                        &nbsp;/&nbsp;
                      </React.Fragment>
                    ) : null}
                    {frontmatter.category}
                  </p>
                )}
                <h1 className="inline-block text-display-xl font-medium text-light-blue-900 tracking-tight">
                  {frontmatter.title}
                </h1>
              </div>
              {!isEmbedded && frontmatter.subtitle && (
                <p className="mt-2 text-lg text-light-blue-800 max-w-screen-sm">
                  {frontmatter.subtitle}
                </p>
              )}
            </header>
          )}
          {props.children}
        </div>
      </div>
    </div>
  );
}
