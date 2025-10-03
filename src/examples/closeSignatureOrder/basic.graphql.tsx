import { CloseSignatureOrderInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';

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
