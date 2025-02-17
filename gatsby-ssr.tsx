import React from 'react';
import { GatsbySSR } from "gatsby"
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import wrapWithProvider from "./src/state/wrap-with-provider";
import MdxLayout from './src/layouts/mdx';
import DefaultLayout from './src/layouts/default';

export const wrapRootElement : GatsbySSR["wrapRootElement"] = wrapWithProvider;
library.add(fas);

export const wrapPageElement : GatsbySSR["wrapPageElement"] = ({props, element}) => {
  if ((props.pageContext as any).frontmatter?.layout === 'default') {
    return (
      <DefaultLayout
        {...props}
      >
        {element}
      </DefaultLayout>
    );
  }
  if (!(props.pageContext as any).frontmatter) {
    return element;
  }
  return (
    <MdxLayout
      {...props}
    >
      {element}
    </MdxLayout>
  );
}