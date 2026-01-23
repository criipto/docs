import React, { useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as SyntaxHighlighter, Prism } from 'react-syntax-highlighter';
import { useLocation } from '@reach/router';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { vscDarkPlus as vsprism } from 'react-syntax-highlighter/dist/esm/styles/prism';

function useQueryParams() {
  const location = useLocation();
  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);
  return params;
}

function replaceParams(input: string, params: URLSearchParams) {
  input = input.replace(
    /{{YOUR_CRIIPTO_DOMAIN}}/g,
    params.get('verify_domain') ?? '{{YOUR_CRIIPTO_DOMAIN}}',
  );
  input = input.replace(
    /{{YOUR_CLIENT_ID}}/g,
    params.get('verify_client_id') ?? '{{YOUR_CLIENT_ID}}',
  );

  input = input.replace(/{{ACR_VALUES(.+?)}}/g, value => {
    if (params.get('verify_acr_values')) {
      return params.get('verify_acr_values')!;
    }
    if (value.includes('||')) {
      const candidate = value.split('||')[1];
      return candidate.substring(0, candidate.length - 2).trim();
    }
    return '{{ACR_VALUES}}';
  });
  return input;
}

export const H2 = (props: { className?: string; children: string; id?: string }) => {
  return (
    <h2
      {...props}
      className={cx(
        'group flex whitespace-pre-wrap -ml-4 pl-4 text-light-blue-900 text-medium text-display-md scroll-mt-[150px] lg:scroll-mt-[90px]',
        props.className,
      )}
    >
      {/* <a className="relative top-[-150px] lg:top-[-90px]"/> */}
      {props.id ? (
        <a
          href={`#${props.id}`}
          className="absolute -ml-10 flex items-center opacity-0 border-0 group-hover:opacity-100 z-30"
          aria-label="Anchor"
        >
          ​
          <div className="w-6 h-6 text-light-blue-900 ring-1 ring-light-blue-300/10 rounded-md shadow-sm flex items-center justify-center hover:ring-light-blue-300/40 hover:shadow hover:text-light-blue-800">
            <svg width="12" height="12" fill="none" aria-hidden="true">
              <path
                d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
        </a>
      ) : null}
      {props.children}
    </h2>
  );
};

export const H3 = (props: { children: string; className?: string; id?: string }) => (
  <h3
    {...props}
    className={`group flex whitespace-pre-wrap -ml-4 pl-4 text-light-blue-900 text-medium text-display-sm scroll-mt-[150px] lg:scroll-mt-[90px] ${props.className ?? ''}`}
  >
    {props.id ? (
      <a
        href={`#${props.id}`}
        className="absolute -ml-10 flex items-center opacity-0 border-0 group-hover:opacity-100"
        aria-label="Anchor"
      >
        ​
        <div className="w-6 h-6 text-light-blue-900 font-medium ring-1 ring-light-blue-300/10 rounded-md shadow-sm flex items-center justify-center hover:ring-light-blue-300/40 hover:shadow hover:text-light-blue-800">
          <svg width="12" height="12" fill="none" aria-hidden="true">
            <path
              d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>
          </svg>
        </div>
      </a>
    ) : null}
    {props.children}
  </h3>
);

const Text = (props: { text: string }) => {
  return <React.Fragment>{props.text}</React.Fragment>;
};

export const CodeBlock = (props: { text: string; className?: string }) => {
  return (
    <pre className={props.className}>
      <code>{props.text}</code>
    </pre>
  );
};

export const Pre = (props: { children: React.ReactElement }) => {
  const child = React.Children.only(props.children);
  if (child && (child.props as any)?.className?.startsWith('language')) {
    return props.children; // Let syntax highlighter handle it.
  }
  if (child && (child.type as any)?.name === 'Code') {
    return props.children; // Let syntax highlighter handle it.
  }

  return <pre>{props.children}</pre>;
};

export const Code = (props: {
  className?: string;
  children: string;
  style?: React.CSSProperties;
}) => {
  const params = useQueryParams();
  const language = props.className?.startsWith('language-')
    ? props.className.replace('language-', '')
    : undefined;
  const text = replaceParams(props.children, params);

  if (!language && !props.children.includes('\n')) {
    return <InlineCode>{props.children}</InlineCode>;
  }

  if (
    (language && SyntaxHighlighter.supportedLanguages.includes(language)) ||
    language === 'html'
  ) {
    return (
      <SyntaxHighlighter
        language={language === 'html' ? 'xml' : language}
        style={vs2015}
        customStyle={{
          padding: '0.85em 1.14em',
          ...props.style,
        }}
      >
        {text}
      </SyntaxHighlighter>
    );
  }
  if (language && Prism.supportedLanguages.includes(language)) {
    return (
      <Prism
        language={language}
        style={vsprism}
        customStyle={{
          padding: '0.85em 1.14em',
          ...props.style,
        }}
      >
        {text}
      </Prism>
    );
  }

  return (
    <pre
      style={{
        background: 'rgb(30, 30, 30)',
        color: 'rgb(220, 220, 220)',
        ...props.style,
      }}
    >
      <code>{text}</code>
    </pre>
  );
};

export const InlineCode = (props: { children: React.ReactNode }) => {
  const params = useQueryParams();
  const children =
    typeof props.children === 'string'
      ? replaceParams(props.children as string, params)
      : props.children;
  return <code className="py-0.5 px-1">{children}</code>;
};

export const Highlight = (props: {
  children: React.ReactNode;
  icon?: string;
  warning?: boolean;
}) => {
  return (
    <div
      className={`mdx-highlight ${props.warning ? 'bg-yellow-25' : 'bg-light-blue-25'} rounded-md p-4 max-w-screen-md ${props.icon ? 'relative pl-10' : ''}`}
    >
      {props.icon ? (
        <FontAwesomeIcon
          style={{ height: '1.5rem' }}
          className="absolute left-4 top-4 text-2xl"
          icon={`fa-solid fa-${props.icon}` as any}
        />
      ) : null}

      {props.children}
    </div>
  );
};

export const Paragraph = (props: any) => {
  return (
    <p {...props} className="max-w-screen-md">
      {props.children}
    </p>
  );
};

export const ImageContainer = (props: { children: React.ReactNode; maxWidth?: number }) => {
  return (
    <div style={{ maxWidth: props.maxWidth ? `${props.maxWidth}px` : undefined }}>
      {props.children}
    </div>
  );
};

export const QueryParam = (props: { param: string; fallback?: string }) => {
  const { param, fallback } = props;
  const params = useQueryParams();
  return params.get(param) ?? fallback;
};

export const Anchor = (props: { children: React.ReactNode; href?: string; to?: string }) => {
  const href = props.href || props.to;
  return <a target={href?.startsWith('http') ? '_top' : undefined} {...props} href={href} />;
};

export const MdxComponents = {
  h2: H2,
  h3: H3,
  Text,
  CodeBlock,
  code: Code,
  pre: Pre,
  inlineCode: InlineCode,
  Highlight,
  ImageContainer,
  p: Paragraph,
  Paragraph,
  ol: (props: any) => (
    <ol {...props} className="max-w-screen-md">
      {props.children}
    </ol>
  ),
  ul: (props: any) => (
    <ul {...props} className="max-w-screen-md">
      {props.children}
    </ul>
  ),
  a: Anchor,
  Link: Anchor,
};

export default function CustomMDXProvider(props: { children: any }) {
  return <MDXProvider components={MdxComponents}>{props.children}</MDXProvider>;
}
