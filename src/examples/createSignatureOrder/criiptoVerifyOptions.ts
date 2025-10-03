import csharp from '!!raw-loader!./criiptoVerifyOptions.cs';
import nodejs from '!!raw-loader!./criiptoVerifyOptions.node.ts';
import { Example } from '../misc';
import { query, variables } from './criiptoVerifyOptions.graphql';

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
