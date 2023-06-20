import React, { useLayoutEffect, useMemo } from 'react';
import { Helmet } from "react-helmet";
import cx from 'classnames';

import {DesktopNavigation, MobileNavigation} from '../components/Navigation';
import Header from '../components/Header';
import { PageNavigationItem } from '../components/PageNavigation';
import { Link } from 'gatsby';

function upperFirst(input: string) {
  if (!input) return input;
  return input.substr(0, 1).toUpperCase() + input.substr(1);
}


export default function DefaultLayout(props: {
  children: React.ReactNode,
  location: Location,
  pageContext: any,
  pageNavigationItems?: PageNavigationItem[]
}) {
  const {frontmatter} = props.pageContext;
  const description = frontmatter.description || frontmatter.subtitle;
  const suffix = 
    frontmatter.title === 'Criipto Documentation' ? '' :
    frontmatter.product ? ` - Criipto ${upperFirst(frontmatter.product)} Documentation` :
    ' - Criipto Documentation';

  const isEmbedded = props.pageContext?.isEmbedded;
  const category = frontmatter.category ? ` - ${frontmatter.category}` : '';
  const title = frontmatter.title + category + suffix;

  useLayoutEffect(() => {
    if (!isEmbedded) return;
    if (!window || !window.parent) return;

    window.parent.postMessage(`height:${document.body.offsetHeight}`, '*');
  }, [isEmbedded]);

  const breadcrumb = 
    props.location.pathname.startsWith('/verify/articles') ? {href: '/verify/articles', label: 'Articles'} :
    props.location.pathname.startsWith('/signatures/articles') ? {href: '/signatures/articles', label: 'Articles'} : null

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        {title && (<title>{title}</title>)}
        <link rel="canonical" href={`https://docs.criipto.com${props.location.pathname}`} />
        {description && (<meta name="description" content={description} />)}
      </Helmet>

      <Header path={props.location.pathname} className={isEmbedded ? 'hidden' : ''} />
      <MobileNavigation key="mobileNav" path={props.location.pathname}  frontmatter={frontmatter} pageNavigationItems={props.pageNavigationItems} isEmbedded={isEmbedded} />
      <div
        className={cx({
          'px-4 sm:px-6 md:px-8': !isEmbedded
        })}
        key="content"
      > 
        <div
          className={cx(
            {'mx-auto max-w-screen-2xl pt-5 lg:pt-10 lg:pl-[19.5rem] xl:pr-[19.5rem]': !isEmbedded}
          )}
        >
          <DesktopNavigation key="desktopNav" path={props.location.pathname} hidden={isEmbedded} />
          <a id="overview" style={{position: "relative", top: "-95px"}} />
          {frontmatter && (
            <header id="header" className="relative z-20 mb-8">
              <div>
                {frontmatter.category && (
                  <p className="mb-2 text-lg leading-6 font-sans font-semibold text-gray-ash-500 uppercase">
                    {breadcrumb ? (
                      <React.Fragment>
                        <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                        &nbsp;/&nbsp;
                      </React.Fragment>
                    ) : null}
                    {frontmatter.category}
                  </p>
                )}
                <h1 className="inline-block text-display-xl font-medium text-deep-purple-900 tracking-tight">{frontmatter.title}</h1>
              </div>
              {frontmatter.subtitle && (<p className="mt-2 text-lg text-gray-ash-700 max-w-screen-sm">{frontmatter.subtitle}</p>)}
            </header>
          )}
          {props.children}
        </div>
      </div>
    </div>
  )
}