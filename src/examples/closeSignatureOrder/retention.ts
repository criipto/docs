import csharp from '!!raw-loader!./retention.cs';
import nodejs from '!!raw-loader!./retention.node.ts';
import { Example } from '../misc';
import { query, variables } from './retention.graphql';

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
