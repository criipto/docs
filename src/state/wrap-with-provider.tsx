import React from 'react';

import { store } from './store';
import { Provider } from 'react-redux';
export default ({ element }: { element: any }) => {
  return <Provider store={store}>{element}</Provider>;
};
