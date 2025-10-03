import React from 'react';
import { CodeBlock } from './MdxProvider';

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
    <pre className={'pb-8 relative'}>
      <code>{url}</code>
      <div className="absolute bottom-1 right-1">
        <button
          className="text-white border rounded-l border-white py-1 px-4"
          onClick={() => navigator.clipboard.writeText(url.replace(/\n\t/g, ''))}
        >
          Copy
        </button>
        <a
          href={url.replace(/\n\t/g, '')}
          className="inline-block text-white border rounded-r border-white py-1 px-4 no-underline"
          target="_blank"
        >
          Open
        </a>
      </div>
    </pre>
  );
}
