import csharp from '!!raw-loader!./preapproved.cs';
import nodejs from '!!raw-loader!./preapproved.node.ts';
import { Example } from '../misc';
import { query, variables } from './preapproved.graphql';

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
