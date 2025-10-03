import { CreateSignatureOrderInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;

export const variables = (data?: ExampleData): { input: CreateSignatureOrderInput } => ({
  input: {
    signatureAppearance: {
      identifierFromEvidence: [
        'cprNumberIdentifier',
        'dk:gov:saml:attribute:CprNumberIdentifier',
        'ssn',
        'http://schemas.grean.id/claims/se/ssn',
        'socialno',
        'http://schemas.grean.id/claims/no/socialno',
      ],
    },
    ...basic.variables(data).input,
  },
});
