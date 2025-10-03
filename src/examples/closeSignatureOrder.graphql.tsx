import { CloseSignatureOrderInput } from '../../graphql-signatures-types';
import { ExampleData } from '../state/store';

export const query = /* Signatures GraphQL */ `
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

      signatories {
        status
      }
    }
  }
}
`.trim();

export const variables = (data: ExampleData): { input: CloseSignatureOrderInput } => ({
  input: {
    signatureOrderId: data.createSignatureOrder?.signatureOrder.id || '[signatureOrder.id]',
  },
});

export const retentionVariables = (data: ExampleData): { input: CloseSignatureOrderInput } => ({
  input: {
    signatureOrderId: data.createSignatureOrder?.signatureOrder.id || '[signatureOrder.id]',
    retainDocumentsForDays: 7,
  },
});

export const signaturesQuery = /* Signatures GraphQL */ `
mutation examplesCloseSignatureOrder(
  $input: CloseSignatureOrderInput!
) {
  closeSignatureOrder(input: $input) {
    signatureOrder {
      id

      documents {
        id
        blob

        signatures {
          __typename
          signatory {
            id
          }

          ... on JWTSignature {
            jwt
            jwks
            claims
          }

          ... on DrawableSignature {
            name
            image
          }

          ... on CompositeSignature {
            signatures {
              __typename
              ... on JWTSignature {
                jwt
                jwks
                claims
              }
    
              ... on DrawableSignature {
                name
                image
              }
            }
          }
        }
      }
    }
  }
}
`.trim();
