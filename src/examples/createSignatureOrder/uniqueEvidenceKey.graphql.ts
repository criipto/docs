import { CreateSignatureOrderInput, DocumentStorageMode } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;

export const variables = (data?: ExampleData): { input: CreateSignatureOrderInput } => ({
  input: {
    evidenceProviders: [
      {
        criiptoVerify: {
          uniqueEvidenceKey: 'sub',
        },
      },
    ],
    ...basic.variables(data).input,
  },
});
