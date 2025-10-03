import csharp from '!!raw-loader!./ui.cs';
import nodejs from '!!raw-loader!./ui.node.ts';
import { Example } from '../misc';
import { query, variables } from './ui.graphql';

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
