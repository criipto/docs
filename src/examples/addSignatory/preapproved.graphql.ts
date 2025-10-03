import { AddSignatoryInput } from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;
export const variables = (data: ExampleData): { input: AddSignatoryInput } => ({
  input: {
    ...basic.variables(data).input,
    documents: data.createSignatureOrder
      ? data.createSignatureOrder.signatureOrder.documents.map(document => ({
          id: document.id,
          preapproved: true,
        }))
      : [
          {
            id: '[signatureOrder.documents[...].id]',
            preapproved: true,
          },
        ],
  },
});
