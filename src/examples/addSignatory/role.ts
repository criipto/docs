import csharp from '!!raw-loader!./role.cs';
import nodejs from '!!raw-loader!./role.node.ts';
import { Example } from '../misc';
import { query, variables } from './role.graphql';

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
