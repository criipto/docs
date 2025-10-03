import { CreateSignatureOrderInput, DocumentStorageMode } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;

export const variables = (data?: ExampleData): { input: CreateSignatureOrderInput } => ({
  input: {
    disableVerifyEvidenceProvider: true,
    evidenceProviders: [
      {
        allOf: {
          providers: [
            {
              criiptoVerify: {
                alwaysRedirect: true,
              },
            },
            {
              drawable: {
                requireName: false,
              },
            },
          ],
        },
      },
    ],
    ...basic.variables(data).input,
  },
});
