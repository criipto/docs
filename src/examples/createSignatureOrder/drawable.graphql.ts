import { CreateSignatureOrderInput, DocumentStorageMode } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;

export const variables = (data?: ExampleData): { input: CreateSignatureOrderInput } => ({
  input: {
    disableVerifyEvidenceProvider: false,
    evidenceProviders: [
      {
        enabledByDefault: true,
        drawable: {
          requireName: true,
        },
      },
    ],
    ...basic.variables(data).input,
  },
});
