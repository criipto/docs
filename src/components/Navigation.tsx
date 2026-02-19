import React, { useState, useMemo } from 'react';
import cx from 'classnames';
import { useStaticQuery, graphql as gatsbyGraphql, Link, GatsbyLinkProps } from 'gatsby';
import { NavigationQuery } from '../../graphql-gatsby-types';
import { PageNavigation, PageNavigationItem } from './PageNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isIndexPage, findIndexPage, slugToPath } from '../utils';
import { ProductSelect } from './ProductSelect';
import { BreadcrumbSeparator } from './BreadcrumbSeparator';
import xMarkIcon from '../images/xmark-icon.svg';
import { SidebarLink } from './SidebarLink';

const SIGNATURES_CATEGORIES = ['Getting Started', 'GraphQL', 'Integrations', 'Guides', 'Webhooks'];

const VERIFY_CATEGORIES = [
  'Getting Started',
  'eIDs',
  'Guides & Tools',
  'Integrations',
  'Reference',
];

interface Props {
  path: string | undefined;
  hidden?: boolean;
  onLinkClick?: () => void;
}

const navigationQuery = gatsbyGraphql`query Navigation {
  signaturesPages: allMdx(
    filter: {frontmatter: {product: {eq: "signatures"}}}
    sort: {frontmatter: {sort: ASC}}
  ) {
    edges {
      node {
        __typename
        id
        fields {
          slug
        }
        internal {
          contentFilePath
        }
        frontmatter {
          title
          category
        }
      }
    }
  }
  verifyPages: allMdx(
    filter: {frontmatter: {product: {eq: "verify"}}}
    sort: {frontmatter: {sort: ASC}}
  ) {
    edges {
      node {
        __typename
        id
        fields {
          slug
        }
        internal {
          contentFilePath
        }
        frontmatter {
          title
          category
        }
      }
    }
  }
}`;

function useNavigationData() {
  const data = useStaticQuery<NavigationQuery>(navigationQuery);

  return useMemo(
    () => ({
      signaturesPages: data.signaturesPages.edges.map(edge => edge.node),
      verifyPages: data.verifyPages.edges.map(edge => edge.node),
    }),
    [data],
  );
}

export default function Navigation(props: Props) {
  const { path, onLinkClick } = props;
  const isVerify = path?.startsWith('/verify');
  const isSignatures = path?.startsWith('/signatures');

  const { signaturesPages, verifyPages } = useNavigationData();

  /* Homepage navigation */
  if (!isVerify && !isSignatures) {
    return (
      <>
        <ProductSelect />
        <ul>
          {/* Verify */}
          <li>
            <Link
              to="/verify"
              className="block mb-3 font-medium text-primary-600 text-lg hover:text-light-blue-900"
              onClick={onLinkClick}
            >
              Idura Verify
            </Link>
            <ul className="space-y-2 border-l border-white text-md font-normal">
              {VERIFY_CATEGORIES.map(category => {
                const indexPage = findIndexPage(category, verifyPages);
                if (!indexPage?.fields?.slug) return null;

                return (
                  <li key={category}>
                    <SidebarLink to={slugToPath(indexPage.fields.slug)} onClick={onLinkClick}>
                      {category}
                    </SidebarLink>
                  </li>
                );
              })}
            </ul>
          </li>

          {/* Signatures */}
          <li className="mt-8">
            <Link
              to="/signatures"
              className="block mb-3 font-medium text-primary-600 text-lg hover:text-light-blue-900"
              onClick={onLinkClick}
            >
              Idura Signatures
            </Link>
            <ul className="space-y-2 border-l border-white text-md font-normal">
              {SIGNATURES_CATEGORIES.map(category => {
                const indexPage = findIndexPage(category, signaturesPages);
                if (!indexPage?.fields?.slug) return null;

                return (
                  <li key={category}>
                    <SidebarLink to={slugToPath(indexPage.fields.slug)} onClick={onLinkClick}>
                      {category}
                    </SidebarLink>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </>
    );
  }

  /* Product-specific navigation */
  const categories = isSignatures ? SIGNATURES_CATEGORIES : VERIFY_CATEGORIES;
  const pages = isSignatures ? signaturesPages : verifyPages;

  return (
    <>
      <ProductSelect />
      <ul>
        {categories.map((category, index) => {
          const categoryIndexPage = findIndexPage(category, pages);
          return (
            <li key={category} className={index > 0 ? 'mt-8' : ''}>
              {/* Category header */}
              {categoryIndexPage?.fields?.slug ? (
                <Link
                  to={slugToPath(categoryIndexPage.fields.slug)}
                  getProps={({ isCurrent }) => ({
                    className: cx(
                      'block mb-3 font-medium',
                      isCurrent
                        ? 'text-light-blue-900'
                        : 'text-primary-600 hover:text-light-blue-900',
                    ),
                  })}
                  onClick={onLinkClick}
                >
                  {category}
                </Link>
              ) : (
                <h5 className="mb-3 font-medium text-primary-600">{category}</h5>
              )}

              {/* Pages */}
              <ul className="space-y-2 border-l border-white text-md font-normal">
                {pages
                  .filter(node => !isIndexPage(node) && node.frontmatter?.category === category)
                  .map(page => (
                    <li key={page.id}>
                      <SidebarLink to={slugToPath(page.fields!.slug!)} onClick={onLinkClick}>
                        {page.frontmatter!.title}
                      </SidebarLink>
                    </li>
                  ))}
                {isVerify && category === 'Reference' && (
                  <SidebarLink onClick={props.onLinkClick} to="/verify/reference/errors">
                    Errors
                  </SidebarLink>
                )}
                {isVerify && category === 'Reference' && (
                  <SidebarLink to="/verify/reference/samples" onClick={props.onLinkClick}>
                    Samples
                  </SidebarLink>
                )}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function DesktopNavigation(props: Props) {
  return (
    <div
      className={cx(
        'hidden border-r border-light-blue-300/40 fixed z-20 inset-0 top-[51px] left-0 pl-[calc(50%-768px)] right-auto overflow-y-auto',
        { 'lg:block': !props.hidden },
      )}
    >
      <div className="w-[17.5rem] py-10 pl-8">
        <Navigation {...props} />
      </div>
    </div>
  );
}

type MobileProps = Props & {
  frontmatter: any;
  pageNavigationItems?: PageNavigationItem[];
  isEmbedded: boolean;
};
export function MobileNavigation(props: MobileProps) {
  const { path, frontmatter } = props;
  const [showNavigation, setShowNavigation] = useState(false);
  const [showPageNavigation, setPageShowNavigation] = useState(false);

  const { signaturesPages, verifyPages } = useNavigationData();

  const cleanPath = (path || '').split('?')[0].replace(/\/+$/, '');
  const isVerify = path?.startsWith('/verify');
  const isSignatures = path?.startsWith('/signatures');

  const pages = isSignatures ? signaturesPages : verifyPages;

  const getMobileBreadcrumb = () => {
    if (!cleanPath) return { category: 'Welcome' };

    let product = undefined;
    if (cleanPath.startsWith('/verify')) product = 'verify';
    if (cleanPath.startsWith('/signatures')) product = 'signatures';

    // If exact match on product root, return only product
    if (cleanPath === `/${product}`) return { product };

    // Otherwise return full details
    return {
      product,
      category: frontmatter?.category,
      title: frontmatter?.title,
    };
  };

  const { product, category, title } = getMobileBreadcrumb();

  const categoryIndexSlug =
    category && (isVerify || isSignatures)
      ? findIndexPage(category, pages)?.fields?.slug
      : undefined;

  const categoryHref = categoryIndexSlug ? slugToPath(categoryIndexSlug) : undefined;
  const currentNode = pages.find(n => slugToPath(n.fields!.slug!) === `${cleanPath}/`);
  const isCategoryIndexPage = currentNode ? isIndexPage(currentNode) : false;

  return (
    <React.Fragment>
      <div
        className={cx(
          'flex justify-between lg:hidden sticky z-30 backdrop-blur duration-500 border-light-blue-300/40 border-b supports-backdrop-blur:bg-white/60 p-4 sm:px-6 md:px-8',
          {
            'top-[45px]': !props.isEmbedded,
            'top-0': props.isEmbedded,
          },
        )}
      >
        <div className="flex">
          {!props.isEmbedded && (
            <button
              type="button"
              className="text-light-blue-600 mr-4"
              onClick={() => setShowNavigation(true)}
            >
              <span className="sr-only">Navigation</span>
              <svg width="24" height="24">
                <path
                  d="M5 6h14M5 12h14M5 18h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                ></path>
              </svg>
            </button>
          )}

          <ol className="flex items-center text-sm leading-6 whitespace-nowrap min-w-0">
            {product && (
              <li className="flex items-center shrink-0">
                <Link to={`/${product}`}>{product === 'verify' ? 'Verify' : 'Signatures'}</Link>
                {category && <BreadcrumbSeparator />}
              </li>
            )}
            {category && title ? (
              <li className="flex items-center min-w-0">
                {categoryHref ? <Link to={categoryHref}>{category}</Link> : <span>{category}</span>}
                {title && !isCategoryIndexPage ? (
                  <>
                    <BreadcrumbSeparator />
                    <span className="font-medium text-light-blue-900 whitespace-normal">
                      {title}
                    </span>
                  </>
                ) : null}
              </li>
            ) : null}
          </ol>
        </div>

        {props.pageNavigationItems ? (
          <button
            type="button"
            className="text-light-blue-600"
            onClick={() => setPageShowNavigation(true)}
          >
            <span className="sr-only">Table of contents</span>
            <FontAwesomeIcon icon={`fa-solid fa-book-open` as any} />
          </button>
        ) : null}
      </div>

      <div
        className={`fixed z-50 inset-0 overscroll-contain overflow-y-auto ${showNavigation ? 'block' : 'hidden'}`}
      >
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowNavigation(false)}
        ></div>
        <div
          className="relative bg-white min-h-full w-80 max-w-[calc(100%-3rem)] p-6"
          onClick={event => event.stopPropagation()}
        >
          <button
            onClick={() => setShowNavigation(false)}
            type="button"
            className="absolute z-10 top-5 right-5 w-8 h-8 flex items-center justify-center"
          >
            <span className="sr-only">Close navigation</span>
            <img src={xMarkIcon} alt="Close navigation" className="cursor-pointer" />
          </button>
          <Navigation {...props} onLinkClick={() => setShowNavigation(false)} />
        </div>
      </div>

      {props.pageNavigationItems ? (
        <div
          className={`fixed z-50 inset-0 overscroll-contain overflow-y-auto ${showPageNavigation ? 'block' : 'hidden'}`}
        >
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setPageShowNavigation(false)}
          ></div>
          <div
            className="absolute bg-light-blue-25 min-h-full w-80 max-w-[calc(100%-3rem)] p-6 right-0"
            onClick={event => event.stopPropagation()}
          >
            <button
              onClick={() => setPageShowNavigation(false)}
              type="button"
              className="absolute z-10 top-5 right-5 w-8 h-8 flex items-center justify-center"
            >
              <span className="sr-only">Close table of contents</span>
              <img src={xMarkIcon} alt="Close table of contents" className="cursor-pointer" />
            </button>

            <PageNavigation
              items={props.pageNavigationItems}
              onNavigate={() => setPageShowNavigation(false)}
              isEmbedded={props.isEmbedded}
            />
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}
