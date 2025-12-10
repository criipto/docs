import csharp from '!!raw-loader!./signatoryRole.cs';
import nodejs from '!!raw-loader!./signatoryRole.node.ts';
import python from '!!raw-loader!./signatoryRole.py';
import { Example } from '../misc';
import { query, variables } from './signatoryRole.graphql';

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
  {
    python,
  },
];

export default example;
