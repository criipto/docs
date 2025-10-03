import { CreateSignatureOrderInput, DocumentStorageMode } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;

export const variables = (data?: ExampleData): { input: CreateSignatureOrderInput } => ({
  input: {
    evidenceProviders: [
      {
        criiptoVerify: {
          acrValues: ['urn:grn:authn:se:bankid:same-device'],
          alwaysRedirect: true,
          scope: 'openid ssn',
          loginHint: 'message:U2lnbmluZyBkb2N1bWVudHM=',
        },
      },
    ],
    ...basic.variables(data).input,
  },
});
