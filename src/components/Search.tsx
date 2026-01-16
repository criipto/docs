import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import type { Hit } from 'instantsearch.js';
import { InstantSearch, SearchBox, Snippet, Highlight, Hits } from 'react-instantsearch';
import { Link } from 'gatsby';

interface HitProps {
  hit: Hit;
  onClick?: React.MouseEventHandler;
}

export const HitComponent = ({ hit, onClick }: HitProps) => {
  const path = `/${hit.slug}/`;

  return (
    <div className="mb-4" onClick={onClick}>
      <Link
        to={path}
        className="block text-xl font-medium text-light-blue-900 tracking-tight mb-0 mt-0 no-underline"
      >
        <Highlight attribute="title" hit={hit} highlightedTagName="mark" /> - {hit.category}
      </Link>

      <Link to={path} className="no-underline">
        <Snippet attribute="excerpt" hit={hit} highlightedTagName="mark" />
      </Link>
    </div>
  );
};

interface SearchProps {
  onHide?: () => void;
  query?: string;
}

export default function Search(props: SearchProps) {
  return (
    <InstantSearch
      searchClient={algoliasearch(
        process.env.GATSBY_ALGOLIA_APP_ID!,
        process.env.GATSBY_ALGOLIA_SEARCH_KEY!,
      )}
      indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME!}
    >
      <SearchBox
        autoFocus
        classNames={{
          root: 'mb-2',
          form: '!shadow-none !border-none bg-light-blue-25 !rounded-none',
          input: '!bg-transparent !font-medium !text-light-blue-900',
        }}
        submitIconComponent={() => (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-5 h-5">
            <path d="M448.1 272c0-97.2-78.8-176-176-176s-176 78.8-176 176 78.8 176 176 176 176-78.8 176-176zm-40.6 158c-36.4 31.2-83.7 50-135.3 50-114.9 0-208-93.1-208-208s93.1-208 208-208 208 93.1 208 208c0 51.7-18.8 99-50 135.3l141.4 141.4 11.3 11.3-22.6 22.6-11.3-11.3-141.4-141.4z" />
          </svg>
        )}
      />
      <Hits hitComponent={({ hit }) => <HitComponent hit={hit} onClick={props.onHide} />} />
    </InstantSearch>
  );
}
