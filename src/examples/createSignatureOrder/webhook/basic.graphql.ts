import { CreateSignatureOrderInput } from '../../../../graphql-signatures-types';
import { ExampleData } from '../../../state/store';
import * as basic from '../basic.graphql';

export const query = basic.query;

export const variables = (data?: ExampleData): { input: CreateSignatureOrderInput } => ({
  input: {
    webhook: {
      url: 'https://httpbin.org/post',
      validateConnectivity: true,
    },
    ...basic.variables(data).input,
  },
});
