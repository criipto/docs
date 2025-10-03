import { CloseSignatureOrderInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';

import * as basic from './basic.graphql';
export const query = basic.query;

export const variables = (data: ExampleData): { input: CloseSignatureOrderInput } => ({
  input: {
    signatureOrderId: data.createSignatureOrder?.signatureOrder.id || '[signatureOrder.id]',
    retainDocumentsForDays: 7,
  },
});
