import { ChangeSignatoryInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';

export const query = /* Signatures GraphQL */ `
mutation exampleChangeSignatory(
  $input: ChangeSignatoryInput!
) {
  changeSignatory(input: $input) {
    signatory {
      id
      href
      token
    }
  }
}
`;

export const variables = (data: ExampleData): { input: ChangeSignatoryInput } => ({
  input: {
    signatoryId: data?.addSignatory?.signatory.id || '[signatory.id]',
    evidenceProviders: data.createSignatureOrder
      ? data.createSignatureOrder?.signatureOrder.evidenceProviders.map(s => ({
          id: s.id,
        }))
      : [{ id: '[signatureOrder.evidenceProviders[0].id]' }],
  },
});

export const drawableExampleVariables = (data: ExampleData): { input: ChangeSignatoryInput } => ({
  input: {
    ...variables(data).input,
    evidenceProviders: [
      {
        id:
          (
            data.createSignatureOrder?.signatureOrder.evidenceProviders.find(
              s => s.__typename === 'DrawableSignatureEvidenceProvider',
            ) ?? data.createSignatureOrder?.signatureOrder.evidenceProviders[0]
          )?.id || '[signatureOrder.evidenceProviders[0].id]',
      },
    ],
  },
});
