import { AddSignatoryInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;
export const variables = (data: ExampleData): { input: AddSignatoryInput } => ({
  input: {
    ...basic.variables(data).input,
    signatureAppearance: {
      identifierFromEvidence: [],
      headerLeft: [
        {
          template:
            '{{$timestamp.YYYY}}-{{$timestamp.MM}}-{{$timestamp.DD}} {{$timestamp.hh}}:{{$timestamp.mm}}:{{$timestamp.ss}} UTC{{$timestamp.zzz}}',
          replacements: [],
        },
      ],
    },
  },
});
