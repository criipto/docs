import { AddSignatoryInput } from "../../../graphql-signatures-types";
import { ExampleData } from "../../state/store";
import * as basic from './basic.graphql';

export const query = basic.query;
export const variables = (data: ExampleData) : {input: AddSignatoryInput} => ({
  input: {
    ...basic.variables(data).input,
    documents: [
      {
        id:
          data.createSignatureOrder?.signatureOrder.documents[1]?.id ??
          (data.createSignatureOrder?.signatureOrder.documents[0]?.id ||
            '[signatureOrder.documents[...].id]'),
      },
    ],
  },
});
