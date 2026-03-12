import React, { useReducer } from 'react';
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
  const page = pages.nodes.find(s => {
    if (s.fields.slug === 'index') return props.path === '/';
    return `/${s.fields.slug}/` === props.path;
  });
  const isEmbedded = props.pageContext?.isEmbedded;

  const [isIduraBannerVisible, setIsIduraBannerVisible] = useReducer(
    (_: boolean, newVal: boolean) => {
      if (typeof window === 'undefined') return false;
      window.localStorage.setItem('iduraBannerVisible', JSON.stringify(newVal));
      return newVal;
    },
    typeof window !== 'undefined'
      ? localStorage.getItem('iduraBannerVisible') !== 'false'
        ? true
        : false
      : false,
  );

  const handleCloseBanner = () => {
    setIsIduraBannerVisible(false);
  };

  return (
    <DefaultLayout
      {...props}
      pageNavigationItems={page?.tableOfContents?.items}
      isIduraBannerVisible={isIduraBannerVisible}
      onCloseBanner={handleCloseBanner}
    >
      <div
        className={cx('relative z-20 prose max-w-none', {
          'pb-48': !isEmbedded,
        })}
      >
        <CustomMDXProvider>{props.children}</CustomMDXProvider>
      </div>
      {/*right-side navigation*/}
      <DesktopPageNavigation
        isEmbedded={isEmbedded}
        items={page?.tableOfContents.items ?? []}
        isIduraBannerVisible={isIduraBannerVisible}
        onCloseBanner={handleCloseBanner}
      />
    </DefaultLayout>
  );
}
