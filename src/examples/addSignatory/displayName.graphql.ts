import { AddSignatoryInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;
export const variables = (data: ExampleData): { input: AddSignatoryInput } => ({
  input: {
    ...basic.variables(data).input,
    signatureAppearance: {
      identifierFromEvidence: [],
      displayName: [
        {
          template: '{{name}} of {{company}}',
          replacements: [
            {
              placeholder: 'name',
              fromEvidence: ['name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            },
            {
              placeholder: 'company',
              fromEvidence: ['2.5.4.10'],
            },
          ],
        },
        {
          template: '{{name}}',
          replacements: [
            {
              placeholder: 'name',
              fromEvidence: ['name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            },
          ],
        },
        {
          template: 'Anonymous',
        },
      ],
    },
  },
});
