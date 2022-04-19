import React from 'react';
import { Helmet } from "react-helmet";

import {DesktopNavigation, MobileNavigation} from '../components/Navigation';
import Header from '../components/Header';
import { PageNavigationItem } from '../components/PageNavigation';

function upperFirst(input: string) {
  if (!input) return input;
  return input.substr(0, 1).toUpperCase() + input.substr(1);
}


export default function DefaultLayout(props: {children: React.ReactNode, pageContext: any, path: string, pageResources: any, pageNavigationItems?: PageNavigationItem[]}) {
  const {frontmatter} = props.pageContext;
  const description = frontmatter.description || frontmatter.subtitle;
  const suffix = 
    frontmatter.title === 'Criipto Documentation' ? '' :
    frontmatter.product ? ` - Criipto ${upperFirst(frontmatter.product)} Documentation` :
    ' - Criipto Documentation';

  const category = frontmatter.category ? ` - ${frontmatter.category}` : '';

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{frontmatter.title}{category}{suffix}</title>
        <link rel="canonical" href={`https://new-docs-test.criipto.com${props.pageResources?.page?.path}`} />
        {description && (<meta name="description" content={description} />)}
      </Helmet>

      <Header path={props.path} />
      <MobileNavigation path={props.path} frontmatter={frontmatter} pageNavigationItems={props.pageNavigationItems} />
      <div className="px-4 sm:px-6 md:px-8">
        <div className="max-w-screen-2xl mx-auto pt-5 lg:pt-10 lg:pl-[19.5rem] xl:pr-[19.5rem]">
          <DesktopNavigation path={props.path} />
          <a id="overview" style={{position: "relative", top: "-95px"}} />
          {frontmatter && (
            <header id="header" className="relative z-20 mb-8">
              <div>
                {frontmatter.category && (<p className="mb-2 text-m leading-6 font-roboto-slab font-semibold text-blue">{frontmatter.category}</p>)}
                <h1 className="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">{frontmatter.title}</h1>
              </div>
              {frontmatter.subtitle && (<p className="mt-2 text-lg text-gray-700 max-w-screen-sm">{frontmatter.subtitle}</p>)}
            </header>
          )}
          {props.children}
        </div>
      </div>
    </div>
  )
}