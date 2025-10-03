import csharp from '!!raw-loader!./displayDocumentID.cs';
import nodejs from '!!raw-loader!./displayDocumentID.node.ts';
import { Example } from '../misc';
import { query, variables } from './displayDocumentID.graphql';

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
