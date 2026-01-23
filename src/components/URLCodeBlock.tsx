import React from 'react';
import { Button, AnchorButton } from './Button/Button';

interface Props {
  url: URL;
}
export default function URLCodeBlock(props: Props) {
  let url = props.url.origin + props.url.pathname;
  let prefix = '?';

  props.url.searchParams.forEach((value, key) => {
    url += `${prefix}${key}=${value}`;
    prefix = '&';
  });
  url = url.replace('?', '?\n\t').replace(/\&/g, '&\n\t');

  return (
    <pre className={'pb-20 relative break-words whitespace-pre-wrap'}>
      <code className="mb-6 whitespace-pre-wrap">{url}</code>
      <div className="absolute bottom-1 right-1 m-4 mt-6 flex gap-3">
        <Button
          variant="dark"
          iconLeft={
            <svg viewBox="0 0 640 640" fill="currentColor" aria-hidden className="w-5">
              <path d="M512 416L256 416L256 96L434.7 96L512 173.3L512 416zM544 160L448 64L224 64L224 448L544 448L544 160zM128 192L96 192L96 576L416 576L416 496L384 496L384 544L128 544L128 224L176 224L176 192L128 192z" />
            </svg>
          }
          onClick={() => navigator.clipboard.writeText(url.replace(/\n\t/g, ''))}
        >
          Copy
        </Button>
        <AnchorButton href={url.replace(/\n\t/g, '')} variant="dark" target="_blank">
          Open
        </AnchorButton>
      </div>
    </pre>
  );
}
