import csharp from '!!raw-loader!./headerLeft.cs';
import nodejs from '!!raw-loader!./headerLeft.node.ts';
import { Example } from '../misc';
import { query, variables } from './headerLeft.graphql';

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
