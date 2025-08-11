import csharp from '!!raw-loader!./sealsPageTemplate.cs';
import nodejs from '!!raw-loader!./sealsPageTemplate.node.ts';
import { Example } from '../misc';
import { query, variables } from './sealsPageTemplate.graphql';

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
