import { ChangeSignatureOrderInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';

export const query = /* Signatures GraphQL */ `
mutation exampleChangeSignatureOrder(
  $input: ChangeSignatureOrderInput!
) {
  changeSignatureOrder(input: $input) {
    signatureOrder {
      id
      maxSignatories
    }
  }
}
`;

export const variables = (data: ExampleData): { input: ChangeSignatureOrderInput } => ({
  input: {
    signatureOrderId: data?.createSignatureOrder?.signatureOrder.id || '[signatureOrder.id]',
    maxSignatories: 20,
  },
});
