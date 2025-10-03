import React from 'react';
import cx from 'classnames';

import DefaultLayout from './default';
import { DesktopPageNavigation } from '../components/PageNavigation';
import CustomMDXProvider from '../components/MdxProvider';
import useAllPages from '../queries/usePages';

export default function MdxLayout(props: {
  children: React.ReactNode;
  location: Location;
  pageContext: any;
  path: string;
}) {
  const { pages } = useAllPages();
  const page = pages.nodes.find(s => `/${s.fields.slug}/` === props.path);
  const isEmbedded = props.pageContext?.isEmbedded;

  return (
    <DefaultLayout {...props} pageNavigationItems={page?.tableOfContents?.items}>
      <div
        className={cx('relative z-20 prose max-w-none', {
          'pb-48': !isEmbedded,
        })}
      >
        <CustomMDXProvider>{props.children}</CustomMDXProvider>
      </div>
      <DesktopPageNavigation isEmbedded={isEmbedded} items={page?.tableOfContents.items ?? []} />
    </DefaultLayout>
  );
}
