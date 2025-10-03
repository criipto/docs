import csharp from '!!raw-loader!./documents.cs';
import nodejs from '!!raw-loader!./documents.node.ts';
import { Example } from '../misc';
import { query, variables } from './documents.graphql';

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
