import { CreateSignatureOrderInput, DocumentStorageMode } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;

export const variables = (data?: ExampleData): { input: CreateSignatureOrderInput } => ({
  input: {
    ...basic.variables().input,
    documents: basic.variables().input.documents.map(doc => ({
      ...doc,
      removePreviousSignatures: true,
    })),
  },
});
