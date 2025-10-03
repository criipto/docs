import csharp from '!!raw-loader!./evidenceValidation.cs';
import nodejs from '!!raw-loader!./evidenceValidation.node.ts';
import { Example } from '../misc';
import { query, variables } from './evidenceValidation.graphql';

const example: Example[] = [
  {
    query,
    variables,
  },
  {
    csharp,
  },
  {
    nodejs,
  },
];

export default example;
