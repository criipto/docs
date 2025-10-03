import React, { useEffect } from 'react';
import * as Sentry from '@sentry/browser';

import MdxLayout from './mdx';

import Search from '../components/Search';
import { H3, Paragraph } from '../components/MdxProvider';

export default function NotFoundLayout(props: {
  children: React.ReactNode;
  location: Location;
  pageContext: any;
  path: string;
  pageResources: any;
}) {
  useEffect(() => {
    Sentry.captureException(`404 page: ${location.pathname || ''}`);
  }, []);

  return (
    <React.Fragment>
      <MdxLayout {...props}>
        {props.children}

        <H3>Search</H3>
        <Paragraph>
          If you are looking for something particular, try using our search feature - You can search
          for things like `bankid production` or `mitid test user`.
        </Paragraph>
        <Search />
      </MdxLayout>
    </React.Fragment>
  );
}
