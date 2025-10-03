import {
  CreateSignatureOrderInput,
  EvidenceValidationStage,
  Language,
} from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;

export const variables = (data?: ExampleData): { input: CreateSignatureOrderInput } => ({
  input: {
    ui: {
      signatoryRedirectUri: 'http://example.com',
      language: 'DA_DK' as Language,
      logo: {
        src: 'https://www.criipto.com/hubfs/logo.svg',
        href: 'https://www.criipto.com',
      },
      stylesheet: 'https://signatures-storybook.criipto.com/custom.css',
    },
    ...basic.variables(data).input,
  },
});
