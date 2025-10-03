import {
  CreateSignatureOrderInput,
  EvidenceValidationStage,
} from '../../../graphql-signatures-types';
import { ExampleData } from '../../state/store';
import * as basic from './basic.graphql';

export const query = basic.query;

export const variables = (data?: ExampleData): { input: CreateSignatureOrderInput } => ({
  input: {
    evidenceValidationStages: [EvidenceValidationStage.VIEW, EvidenceValidationStage.SIGN],
    ...basic.variables(data).input,
  },
});
