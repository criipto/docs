import csharp from '!!raw-loader!./pdfFormFilling.cs';
import nodejs from '!!raw-loader!./pdfFormFilling.node.ts';
import { Example } from '../misc';
import { query, variables } from './pdfFormFilling.graphql';

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
