import React, { useState } from 'react';
import {match, P} from 'ts-pattern';
import GraphQLExplorer from './GraphQLExplorer';
import { Button } from './Button/Button';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  GraphQLExample,
  Example,
  toLanguageDisplay,
  ExampleLanguage,
  EXAMPLE_LANGUAGES,
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

function RawGraphQLExampleComponent(props: { example: GraphQLExample; className?: string, style?: React.CSSProperties }) {
  const data = useAppSelector(state => state.exampleData);
  const variables = props.example.variables
    ? JSON.stringify(props.example.variables(data), null, 2)
    : null;
  const query = props.example.query.trim();

  return (
    <React.Fragment>
      <HideableCodeBlock
        text={'# Query\n' + query}
        className={`block ${props.className ?? ''}`}
        style={props.style}
      />
      {variables && (
        <HideableCodeBlock
          text={'# Variables\n' + variables}
          className={`block ${props.className ?? ''}`}
        />
      )}
    </React.Fragment>
  );
}

function InteractiveGraphQLExampleComponent(props: { example: GraphQLExample; style?: React.CSSProperties }) {
  const data = useAppSelector(state => state.exampleData);
  const hasSkipped = data.language === 'graphql-raw';
  const dispatch = useAppDispatch();
  const variables = props.example.variables
    ? JSON.stringify(props.example.variables(data), null, 2)
    : null;
  const query = props.example.query.trim();

  return (
    <React.Fragment>
      <RawGraphQLExampleComponent
        example={props.example}
        className={hasSkipped ? 'block' : 'block lg:hidden'}
        style={props.style}
      />
      <GraphQLExplorer
        query={query}
        variables={variables}
        className={hasSkipped ? 'hidden' : 'hidden lg:block'}
        onSkipCredentials={() => dispatch(setLanguage('graphql-raw'))}
        style={props.style}
      />
    </React.Fragment>
  );
}

export default function SignaturesExample(props: Props) {
  const examples = Array.isArray(props.example) ? props.example : [props.example];
  const language = useAppSelector(state => state.exampleData.language);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(event.target.value as ExampleLanguage))
  };

  const languagePicker = (
    <select
      className="shadow border rounded py-1 px-2 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
      value={language ?? ''}
      onChange={handleChange}
    >
      <option value="" disabled>Pick coding language to view example</option>
      {EXAMPLE_LANGUAGES.map(language => (
        <option value={language}>{toLanguageDisplay(language)}</option>
      ))}
    </select>
  );

  if (!language) {
    return (
      <div>
        {languagePicker}
      </div>
    )
  }

  const example = 
    examples.find(e => 
      match({example: e, language})
        .with({
          example: {
            query: P.string,
          },
          language: 'graphql-raw'
        }, () => true)
        .with({
          example: {
            query: P.string,
          },
          language: 'graphql-interactive'
        }, () => true)
        .with({
          example: {
            csharp: P.string,
          },
          language: 'csharp'
        }, () => true)
        .with({
          example: {
            nodejs: P.string,
          },
          language: 'nodejs'
        }, () => true)
        .with({
          example: {
            python: P.string,
          },
          language: 'python'
        }, () => true)
        .otherwise(() => false)
    ) 
    ?? examples.find(e => 'query' in e)
    ?? null;

  if (!example) {
    console.error(`Unable to determine example for ${language}/${JSON.stringify(examples)}`);
    return null;
  }
  
  return (
    <React.Fragment>
      <div className="flex flex-row justify-end">
        {languagePicker}
      </div>
      {
        match({example, language})
          .with({
            example: {
              csharp: P.string,
            }
          }, ({example}) => (
            <Code className="language-csharp" style={{ marginTop: '1px' }}>
              {example.csharp}
            </Code>
          ))
          .with({
            example: {
              nodejs: P.string
            }
          }, ({example}) => (
            <Code className="language-javascript" style={{ marginTop: '1px' }}>
              {example.nodejs}
            </Code>
          ))
          .with({
            example: {
              python: P.string
            }
          }, ({example}) => (
            <Code className="language-python" style={{ marginTop: '1px' }}>
              {example.python}
            </Code>
          ))
          .with({
            example: {
              query: P.string,
            },
            language: 'graphql-interactive'
          }, ({example}) => (
            <InteractiveGraphQLExampleComponent example={example} style={{ marginTop: '1px' }} />
          ))
          .with({
            example: {
              query: P.string,
            },
            language: 'graphql-raw'
          }, ({example}) => (
            <RawGraphQLExampleComponent example={example} style={{ marginTop: '1px' }} />
          ))
          .with({
            example: {
              query: P.string,
            },
            language: P.any
          }, ({example}) => (
            <RawGraphQLExampleComponent example={example} style={{ marginTop: '1px' }} />
          ))
          .exhaustive()
      }
    </React.Fragment>
  );
}
