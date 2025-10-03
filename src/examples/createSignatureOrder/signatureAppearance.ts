import csharp from '!!raw-loader!./signatureAppearance.cs';
import nodejs from '!!raw-loader!./signatureAppearance.node.ts';
import { Example } from '../misc';
import { query, variables } from './signatureAppearance.graphql';

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
