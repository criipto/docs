import {
  BatchSignatoryItemInput,
  CreateBatchSignatoryInput,
  Language,
} from '../../../graphql-signatures-types';

export const query = /* Signatures GraphQL */ `
mutation examplesCreateBatchSignatory(
  $input: CreateBatchSignatoryInput!
) {
  createBatchSignatory(input: $input) {
    batchSignatory {
      id
      token
      href

      items {
        signatory {
          id
        }

        signatureOrder {
          id
        }
      }
    }
  }
}
`.trim();

export const variables = (data?: {
  signatories: BatchSignatoryItemInput[];
}): { input: CreateBatchSignatoryInput } => {
  const batchItems = data?.signatories ?? [
    {
      signatoryId: '[signatoryA.id]',
      signatureOrderId: '[signatureOrderA.id]',
    },
    {
      signatoryId: '[signatoryB.id]',
      signatureOrderId: '[signatureOrderB.id]',
    },
  ];
  return {
    input: {
      ui: {
        signatoryRedirectUri: 'https://example.com',
        language: Language.SV_SE,
      },
      items: batchItems,
    },
  };
};
