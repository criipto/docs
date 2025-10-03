import csharp from '!!raw-loader!./uniqueEvidenceKey.cs';
import nodejs from '!!raw-loader!./uniqueEvidenceKey.node.ts';
import { Example } from '../misc';
import { query, variables } from './uniqueEvidenceKey.graphql';

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
