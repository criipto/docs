import csharp from '!!raw-loader!./drawable.cs';
import nodejs from '!!raw-loader!./drawable.node.ts';
import { Example } from '../misc';
import { query, variables } from './drawable.graphql';

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
