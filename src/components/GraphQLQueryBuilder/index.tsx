import React from 'react';
import CreateSignatureOrder from './createSignatureOrder';
import AddSignatory from './addSignatory';

interface Props {
  query: 'createSignatureOrder' | 'addSignatory';
}
export default function GraphQLQueryBuilder(props: Props) {
  switch (props.query) {
    case 'createSignatureOrder':
      return <CreateSignatureOrder />;
    case 'addSignatory':
      return <AddSignatory />;
    default:
      return null;
  }
}
