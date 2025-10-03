import { AddSignatoriesInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';

export const query = /* Signatures GraphQL */ `
mutation exampleAddSignatories(
  $input: AddSignatoriesInput!
) {
  addSignatories(input: $input) {
    signatories {
      id
      href
    }
  }
}
`;

export const variables = (data: ExampleData): { input: AddSignatoriesInput } => ({
  input: {
    signatureOrderId: data?.createSignatureOrder?.signatureOrder.id || '[signatureOrder.id]',
    signatories: [
      {
        reference: 'A',
        documents: data.createSignatureOrder
          ? data.createSignatureOrder.signatureOrder.documents.map(document => ({
              id: document.id,
              preapproved: true,
            }))
          : [
              {
                id: '[signatureOrder.documents[...].id]',
                preapproved: true,
              },
            ],
      },
      {
        reference: 'B',
        evidenceValidation: [{ key: 'cprNumberIdentifier', value: '112233445555' }],
      },
    ],
  },
});
