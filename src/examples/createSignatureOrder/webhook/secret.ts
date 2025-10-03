import csharp from '!!raw-loader!./secret.cs';
import nodejs from '!!raw-loader!./secret.node.ts';
import { Example } from '../../misc';
import { query, variables } from './secret.graphql';

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
