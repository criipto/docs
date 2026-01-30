import React from 'react';
import { Button, AnchorButton } from './Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

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
            <FontAwesomeIcon icon={faCopy} fill="currentColor" aria-hidden className="w-5" />
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
