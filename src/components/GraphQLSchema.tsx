import React, { useMemo } from 'react';
import {
  DocExplorer,
  EditorContextProvider,
  ExplorerContextProvider,
  SchemaContextProvider,
} from '@graphiql/react';
import { buildClientSchema, IntrospectionQuery } from 'graphql';

import './GraphQLSchema.css';
import jsonSchema from '../../graphql-signatures-schema.json';
import { createGraphiQLFetcher } from '@graphiql/toolkit';

const schema = buildClientSchema(jsonSchema.data as any as IntrospectionQuery);

interface GraphQLSchemaProps {}
export default function GraphQLSchemaComponent(props: GraphQLSchemaProps) {
  const fetcher = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createGraphiQLFetcher({
      url: 'https://signatures-api.criipto.com/v1/graphql',
    });
  }, []);

  if (fetcher === null) return null;

  return (
    <EditorContextProvider>
      <SchemaContextProvider fetcher={fetcher} schema={schema}>
        <ExplorerContextProvider>
          <div className="graphiql-container graphql-schema" style={{ display: 'block' }}>
            <DocExplorer />
            {/* <SchemaDocumentation schema={schema} /> */}
          </div>
        </ExplorerContextProvider>
      </SchemaContextProvider>
    </EditorContextProvider>
  );
}
