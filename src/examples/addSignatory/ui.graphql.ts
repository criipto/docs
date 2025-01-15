import { AddSignatoryInput, Language } from "../../../graphql-signatures-types";
import { ExampleData } from "../../state/store";
import * as basic from './basic.graphql';

export const query = basic.query;
export const variables = (data: ExampleData) : {input: AddSignatoryInput} => ({
  input: {
    ...basic.variables(data).input,
    ui: {
      language: Language.SV_SE
    }
  }
});
