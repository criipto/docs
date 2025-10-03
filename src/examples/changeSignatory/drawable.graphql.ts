import { ChangeSignatoryInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;

export const variables = (data: ExampleData): { input: ChangeSignatoryInput } => ({
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
