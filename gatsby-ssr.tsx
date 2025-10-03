import React from 'react';
import { GatsbySSR } from 'gatsby';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import wrapWithProvider from './src/state/wrap-with-provider';
import MdxLayout from './src/layouts/mdx';
import DefaultLayout from './src/layouts/default';
import FullscreenLayout from './src/layouts/fullscreen';
import NotFoundLayout from './src/layouts/404';
import VerifyErrorLayout from './src/layouts/verify-error';

export const wrapRootElement: GatsbySSR['wrapRootElement'] = wrapWithProvider;
library.add(fas);

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({ props, element }) => {
  if ((props.pageContext as any).frontmatter?.layout === 'default') {
    return <DefaultLayout {...props}>{element}</DefaultLayout>;
  }

  if ((props.pageContext as any).frontmatter?.layout === 'fullscreen') {
    return <FullscreenLayout {...props}>{element}</FullscreenLayout>;
  }
  if ((props.pageContext as any).frontmatter?.layout === '404') {
    return <NotFoundLayout {...props}>{element}</NotFoundLayout>;
  }
  if ((props.pageContext as any).frontmatter?.layout === 'verify-error') {
    return <VerifyErrorLayout {...props}>{element}</VerifyErrorLayout>;
  }
  if (!(props.pageContext as any).frontmatter) {
    return element;
  }
  return <MdxLayout {...props}>{element}</MdxLayout>;
};
