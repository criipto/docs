import csharp from '!!raw-loader!./sealPosition.cs';
import nodejs from '!!raw-loader!./sealPosition.node.ts';
import { Example } from '../misc';
import { query, variables } from './sealPosition.graphql';

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
