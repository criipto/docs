import React from 'react';
import GraphQLExplorer from '../../../../components/GraphQLExplorer';
import { AddSignatoryInput } from "../../../../../graphql-signatures-types";

export const query = /* Signatures GraphQL */`
mutation exampleAddSignatory(
  $input: AddSignatoryInput!
) {
  addSignatory(input: $input) {
    signatureOrder {
      signatories {
        id
        href
      }
    }

    signatory {
      id
      href
    }
  }
}
`;

export const variables = () : {input: AddSignatoryInput} => ({
  input: {
    signatureOrderId: "[REQUIRED]"
  }
});

export function Explorer() {
  return (
    <GraphQLExplorer query={query.trim()} variables={variables()} />
  )
}