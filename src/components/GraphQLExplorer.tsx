import React, {useState, useMemo, useCallback} from 'react';
import GraphiQL from 'graphiql';
import { Link } from 'gatsby';

import {ApiCredentials, setApiCredentials, setCreateSignatureOrder, setCloseSignatureOrder, setAddSignatory} from '../state/store';
import {useAppDispatch, useAppSelector} from '../state/hooks';

interface GraphQLParams {
  query: string,
  variables?: string
}

export interface GraphQLError {
  message: string
}
export interface GraphQLResponse<T = any> {
  data?: T,
  errors?: GraphQLError[]
}

export function graphQLFetcher(graphQLParams : GraphQLParams, credentials: ApiCredentials | null) : Promise<GraphQLResponse> {
  const headers : RequestInit["headers"] = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (credentials) {
    headers.Authorization = `Basic ${btoa(`${credentials.clientID}:${credentials.clientSecret}`)}`
  }

  return fetch(
    'https://signatures-api-prod.azurewebsites.net/v1/graphql',
    {
      method: 'post',
      headers,
      body: JSON.stringify(graphQLParams),
      credentials: 'omit',
    },
  ).then(function (response) {
    return response.json().then(response => {
      return response;
    }).catch(function () {
      return response.text().then(error => {
        throw new Error(error)
      });
    });
  });
}

export function graphQLFetcherFactory(credentials: ApiCredentials | null, onResponse: (response: GraphQLResponse) => void) {
  return (graphQLParams: GraphQLParams) => {
    return graphQLFetcher(graphQLParams, credentials).then(response => {
      onResponse(response);
      return response;
    });
  }
}

interface GraphQLExplorerProps {
  query?: string
  variables?: string | any
  className?: string,
  onResponse?: (response: GraphQLResponse) => void 
}
export default function GraphQLExplorer(props: GraphQLExplorerProps) {
  const {query, variables} = props;
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
        dispatch(setAddSignatory(response.data.createSignatureOrder));
      }
    }
    if (props.onResponse) props.onResponse(response);
  }, []);
  const graphqlFetcher = useMemo(() => graphQLFetcherFactory(credentials, handleResponse), [credentials, handleResponse]);

  return (
    <div className={props.className}>
      {credentials && (
        <p className="bg-gray-300 p-2 rounded-t mb-0">
          Queries are executed against your actual application. Please make sure you are using test credentials.
        </p>
      )}
      <div style={{height: "700px"}} className="relative">
        <GraphiQL
          fetcher={graphqlFetcher}
          defaultVariableEditorOpen={true}
          defaultSecondaryEditorOpen={true}
          query={query}
          variables={typeof variables === 'object' ? JSON.stringify(variables, null, 2) : variables}
          docExplorerOpen={false}
          headerEditorEnabled={false}
        />

        {!credentials && (<CredentialsOverlay />)}
      </div>
    </div>
  );
}

export function CredentialsForm(props: {className?: string, children?: React.ReactNode}) {
  const dispatch = useAppDispatch();

  const [clientID, setClientID] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    dispatch(setApiCredentials({
      clientID,
      clientSecret
    }));
  };

  return (
    <form className={`px-8 pt-6 pb-8 mb-4 ${props.className || ''}`} onSubmit={handleSubmit}>
      {props.children}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientID">
          Client ID
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="clientID"
          type="text"
          placeholder="Client ID"
          onChange={(event) => setClientID(event.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientSecret">
          Client Secret
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="clientSecret"
          type="password"
          placeholder="Client Secret"
          onChange={(event) => setClientSecret(event.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button className="bg-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Submit
        </button>
      </div>
    </form>
  )
}

function CredentialsOverlay() {
  return (
    <div className="w-full h-full bg-white/60 backdrop-blur absolute top-0 left-0 z-20 flex flex-col items-center justify-center">
      <CredentialsForm className="bg-white shadow-md rounded max-w-md">
        <p>Please enter your <Link to="/document-signatures/getting-started/register-application/">API credentials</Link> to use this GraphQL Example</p>
        <p>Queries are executed against your actual application. Please make sure you are using test credentials.</p>
      </CredentialsForm>
    </div>
  )
}