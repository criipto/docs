import csharp from '!!raw-loader!./composite-allOf.cs';
import nodejs from '!!raw-loader!./composite-allOf.node.ts';
import { Example } from '../misc';
import { query, variables } from './composite-allOf.graphql';

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
