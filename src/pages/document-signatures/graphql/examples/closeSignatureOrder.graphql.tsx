import React from 'react';
import GraphQLExplorer from '../../../../components/GraphQLExplorer';
import { CloseSignatureOrderInput } from "../../../../../graphql-signatures-types";

export const query = /* Signatures GraphQL */`
mutation examplesCloseSignatureOrder(
  $input: CloseSignatureOrderInput!
) {
  closeSignatureOrder(input: $input) {
    signatureOrder {
      id

      documents {
        id
        blob
      }
    }
  }
}
`.trim();

export const variables = () : {input: CloseSignatureOrderInput} => ({
  input: {
    signatureOrderId: "[REQUIRED]"
  }
});


export function Explorer() {
  return (
    <GraphQLExplorer query={query.trim()} variables={variables()} />
  )
}