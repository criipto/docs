import csharp from '!!raw-loader!./sealPositionScaled.cs';
import nodejs from '!!raw-loader!./sealPositionScaled.node.ts';
import python from '!!raw-loader!./sealPositionScaled.py';
import { Example } from '../misc';
import { query, variables } from './sealPositionScaled.graphql';

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
