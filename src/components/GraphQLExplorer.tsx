import React, { useState, useMemo, useCallback } from 'react';
import cx from 'classnames';
import { GraphiQL } from 'graphiql';
import { Link } from 'gatsby';
import { Button } from './Button/Button';
import { GraphQLError } from 'graphql';

import {
  ApiCredentials,
  setApiCredentials,
  clearApiCredentials,
  setCreateSignatureOrder,
  setCloseSignatureOrder,
  setAddSignatory,
} from '../state/store';
import { useAppDispatch, useAppSelector } from '../state/hooks';

import './GraphQLExplorer.css';

interface GraphQLParams<T = any> {
  query: string;
  variables?: T;
}

export interface SignatoryCredentials {
  token: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: readonly GraphQLError[];
}

export function graphQLFetcher<R = any, V = any>(
  graphQLParams: GraphQLParams<V>,
  credentials: ApiCredentials | SignatoryCredentials | null,
): Promise<GraphQLResponse<R>> {
  const headers: RequestInit['headers'] = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Criipto-Sdk': 'docs.criipto.com',
  };

  if (credentials && 'clientID' in credentials) {
    headers.Authorization = `Basic ${btoa(`${credentials.clientID}:${credentials.clientSecret}`)}`;
  }
  if (credentials && 'token' in credentials) {
    headers['Signatory-Token'] = credentials.token;
  }

  return fetch('https://signatures-api.criipto.com/v1/graphql', {
    method: 'post',
    headers,
    body: JSON.stringify(graphQLParams),
    credentials: 'omit',
  }).then(function (response) {
    if (response.ok) {
      return response.json().then(response => {
        return response;
      });
    }
    return response.text().then(error => {
      throw new Error(error);
    });
  });
}

export function graphQLFetcherFactory(
  credentials: ApiCredentials | null,
  onResponse: (response: GraphQLResponse<any>) => void,
) {
  return (graphQLParams: GraphQLParams) => {
    return graphQLFetcher(graphQLParams, credentials).then(response => {
      onResponse(response);
      return response;
    });
  };
}

interface GraphQLExplorerProps {
  query?: string;
  variables?: string | any;
  className?: string;
  onResponse?: (response: GraphQLResponse) => void;
  onSkipCredentials?: () => void;
  style?: React.CSSProperties;
  fullscreen?: boolean;
}
export default function GraphQLExplorer(props: GraphQLExplorerProps) {
  const { query, variables } = props;
  const credentials = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const handleResponse = useCallback((response: GraphQLResponse) => {
    if (response.data) {
      if (response.data.createSignatureOrder) {
        dispatch(setCreateSignatureOrder(response.data.createSignatureOrder));
      }
      if (response.data.closeSignatureOrder) {
        dispatch(setCloseSignatureOrder(response.data.closeSignatureOrder));
      }
      if (response.data.addSignatory) {
        dispatch(setAddSignatory(response.data.addSignatory));
      }
    }
    if (props.onResponse) props.onResponse(response);
  }, []);
  const graphqlFetcher = useMemo(
    () => graphQLFetcherFactory(credentials, handleResponse),
    [credentials, handleResponse],
  );

  if (typeof window === 'undefined') return null;

  return (
    <div
      className={cx(
        {
          'h-svh flex flex-col': props.fullscreen,
        },
        props.className,
      )}
      style={props.fullscreen ? { height: '100svh' } : {}}
    >
      {credentials && (
        <p className="bg-light-blue-25 p-2 rounded-t mb-0" style={props.style}>
          Queries are executed against your actual application. Please make sure you are using test
          credentials.
        </p>
      )}
      <div
        style={props.fullscreen ? {} : { height: '900px' }}
        className={cx('relative', {
          'flex-1': props.fullscreen,
        })}
      >
        <GraphiQL
          fetcher={graphqlFetcher}
          query={query}
          variables={typeof variables === 'object' ? JSON.stringify(variables, null, 2) : variables}
          defaultEditorToolsVisibility={'variables'}
          isHeadersEditorEnabled={false}
          className="criipto-graphql-explorer"
          forcedTheme="light"
        />

        {!credentials && <CredentialsOverlay onSkip={props.onSkipCredentials} />}
      </div>
    </div>
  );
}

export function CredentialsForm(props: {
  className?: string;
  children?: React.ReactNode;
  onSkip?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const [clientID, setClientID] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setPending(true);

    const response = await graphQLFetcher<{ viewer: { __typename: string } }>(
      {
        query: `{ viewer { __typename }}`,
      },
      {
        clientID,
        clientSecret,
      },
    );

    setPending(false);

    if (response.errors) {
      setError(response.errors[0].message);
    } else {
      if (response.data?.viewer.__typename !== 'Application') {
        setError('Invalid credentials');
      } else {
        dispatch(
          setApiCredentials({
            clientID,
            clientSecret,
          }),
        );
      }
    }
  };

  return (
    <form className={`px-8 pt-6 pb-8 mb-4 ${props.className || ''}`} onSubmit={handleSubmit}>
      {props.children}
      <div className="mb-4">
        <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="clientID">
          Client ID
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
          id="clientID"
          type="text"
          placeholder="Client ID"
          onChange={event => setClientID(event.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-light-blue-800 text-sm font-medium mb-2"
          htmlFor="clientSecret"
        >
          Client Secret
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
          id="clientSecret"
          type="password"
          placeholder="Client Secret"
          onChange={event => setClientSecret(event.target.value)}
          required
        />
      </div>
      {error ? (
        <div className="mt-4 mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : null}
      <div className="flex gap-3 items-center justify-end">
        {props.onSkip && (
          <Button variant="default" onClick={() => props.onSkip!()}>
            Skip
          </Button>
        )}
        <Button variant="primary" type="submit" disabled={pending}>
          Submit
        </Button>
      </div>
    </form>
  );
}

export function ClearCredentialsButton() {
  const credentials = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(clearApiCredentials());
  };

  if (!credentials) return <p>No credentials configured.</p>;
  return (
    <Button variant="primary" onClick={handleClick}>
      Clear credentials
    </Button>
  );
}

function CredentialsOverlay(props: { onSkip?: () => void }) {
  return (
    <div className="w-full h-full bg-white/60 backdrop-blur absolute top-0 left-0 z-20 flex flex-col items-center justify-center">
      <CredentialsForm className="bg-white shadow-md rounded max-w-md" onSkip={props.onSkip}>
        <p>
          Please enter your{' '}
          <Link to="/signatures/getting-started/register-application/">API credentials</Link> to use
          this GraphQL Example
        </p>
        <p>
          Queries are executed against your actual application. Please make sure you are using test
          credentials.
        </p>
      </CredentialsForm>
    </div>
  );
}
