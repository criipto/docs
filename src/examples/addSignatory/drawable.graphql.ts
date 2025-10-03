import { AddSignatoryInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;
export const variables = (data: ExampleData): { input: AddSignatoryInput } => ({
  input: {
    ...basic.variables(data).input,
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
