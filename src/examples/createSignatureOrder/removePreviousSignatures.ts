import csharp from '!!raw-loader!./removePreviousSignatures.cs';
import nodejs from '!!raw-loader!./removePreviousSignatures.node.ts';
import { Example } from '../misc';
import { query, variables } from './removePreviousSignatures.graphql';

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
