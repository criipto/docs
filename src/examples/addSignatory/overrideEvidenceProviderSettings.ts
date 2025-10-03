import csharp from '!!raw-loader!./overrideEvidenceProviderSettings.cs';
import nodejs from '!!raw-loader!./overrideEvidenceProviderSettings.node.ts';
import { Example } from '../misc';
import { query, variables } from './overrideEvidenceProviderSettings.graphql';

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
