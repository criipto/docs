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
          data.createSignatureOrder?.signatureOrder.evidenceProviders[0].id ??
          "[signatureOrder.evidenceProviders['CriiptoVerifySignatureEvidenceProvider'].id]",
        criiptoVerify: {
          acrValues: [
            'urn:grn:authn:dk:mitid:substantial',
            'urn:grn:authn:se:bankid:another-device:qr',
            'urn:grn:authn:no:bankid:substantial',
          ],
          message: 'signatory message',
          loginHint: 'signatory login hint',
        },
      },
    ],
  },
});
