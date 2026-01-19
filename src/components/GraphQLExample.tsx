import React, { useState } from 'react';
import GraphQLExplorer from './GraphQLExplorer';
import { Button } from './Button/Button';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  GraphQLExample,
  Example,
  toExampleDisplay,
  toExampleLanguage,
  ExampleLanguage,
} from '../examples/misc';
import { Code } from './MdxProvider';
import { setLanguage } from '../state/store';

interface Props {
  example: Example[] | GraphQLExample;
}

function HideableCodeBlock(props: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [hasHiddenCode, setCodeHidden] = useState(false);
  return (
    <pre
      className={`${props.className} pb-8 relative ${hasHiddenCode ? 'h-[43px] overflow-hidden' : ''}`}
      style={props.style}
    >
      <code>{props.text}</code>
      <div className="absolute top-1 right-1">
        {hasHiddenCode ? (
          <Button variant="dark" size="sm" onClick={() => setCodeHidden(false)}>
            Show
          </Button>
        ) : (
          <Button variant="dark" size="sm" onClick={() => setCodeHidden(true)}>
            Hide
          </Button>
        )}
      </div>
    </pre>
  );
}

function GraphQLExampleComponent(props: { example: GraphQLExample; style?: React.CSSProperties }) {
  const [hasSkipped, setSkipped] = useState(false);
  const data = useAppSelector(state => state.exampleData);
  const variables = props.example.variables
    ? JSON.stringify(props.example.variables(data), null, 2)
    : null;
  const query = props.example.query.trim();

  return (
    <React.Fragment>
      <HideableCodeBlock
        text={'# Query\n' + query}
        className={hasSkipped ? 'block' : 'block lg:hidden'}
        style={props.style}
      />
      {variables && (
        <HideableCodeBlock
          text={'# Variables\n' + variables}
          className={hasSkipped ? 'block' : 'block lg:hidden'}
        />
      )}
      <GraphQLExplorer
        query={query}
        variables={variables}
        className={hasSkipped ? 'hidden' : 'hidden lg:block'}
        onSkipCredentials={() => setSkipped(true)}
        style={props.style}
      />
    </React.Fragment>
  );
}

export default function SignaturesExample(props: Props) {
  if ('query' in props.example) {
    return <GraphQLExampleComponent example={props.example} />;
  }

  const language = useAppSelector(state => state.exampleData.language);
  const dispatch = useAppDispatch();
  const example = props.example.find(e => toExampleLanguage(e) === language) ?? props.example[0];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(event.target.value as ExampleLanguage));
  };

  return (
    <React.Fragment>
      {props.example.length > 1 ? (
        <div className="flex flex-row justify-end">
          <select
            className="shadow border rounded py-1 px-2 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            value={language}
            onChange={handleChange}
          >
            {props.example.map(example => (
              <option value={toExampleLanguage(example)}>{toExampleDisplay(example)}</option>
            ))}
          </select>
        </div>
      ) : null}
      {'csharp' in example ? (
        <Code className="language-csharp" style={{ marginTop: '1px' }}>
          {example.csharp}
        </Code>
      ) : 'nodejs' in example ? (
        <Code className="language-javascript" style={{ marginTop: '1px' }}>
          {example.nodejs}
        </Code>
      ) : 'python' in example ? (
        <Code className="language-python" style={{ marginTop: '1px' }}>
          {example.python}
        </Code>
      ) : 'query' in example ? (
        <GraphQLExampleComponent example={example} style={{ marginTop: '1px' }} />
      ) : null}
    </React.Fragment>
  );
}
