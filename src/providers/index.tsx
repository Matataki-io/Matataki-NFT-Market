import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../store';
import { light, dark } from '../themes';

const Providers: React.FC = ({ children }) => (
  <ReduxProvider store={store}>
    <GeistProvider themes={[light, dark]}>
      <CssBaseline />
      {children}
    </GeistProvider>
  </ReduxProvider>
);

export default Providers;
