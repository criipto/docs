import { CancelSignatureOrderInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';

export const query = /* Signatures GraphQL */ `
mutation examplesCancelSignatureOrder(
  $input: CancelSignatureOrderInput!
) {
  cancelSignatureOrder(input: $input) {
    signatureOrder {
      id
    }
  }
}
`.trim();

export const variables = (data: ExampleData): { input: CancelSignatureOrderInput } => ({
  input: {
    signatureOrderId: data.createSignatureOrder?.signatureOrder.id || '[signatureOrder.id]',
  },
});
