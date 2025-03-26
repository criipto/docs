import React from 'react';
import {DocExplorer} from 'graphiql';
import {buildClientSchema, IntrospectionQuery} from 'graphql';

import './GraphQLSchema.css'
import jsonSchema from '../../graphql-signatures-schema.json';
const schema = buildClientSchema(jsonSchema.data as any as IntrospectionQuery);

interface GraphQLSchemaProps {}
export default function GraphQLSchemaComponent(props: GraphQLSchemaProps) {
  return (
    <div className="graphiql-container graphql-schema">
      <DocExplorer schema={schema} />
    </div>
  )
}