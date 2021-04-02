import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { Provider as ReduxProvider } from 'react-redux';
import { UseWalletProvider } from 'use-wallet';
import store from '../store';
import { light, dark } from '../themes';
import { currentChainId } from '../constant';

const Providers: React.FC = ({ children }) => (
  <ReduxProvider store={store}>
    <UseWalletProvider
      chainId={currentChainId}
      connectors={{
        injected: {},
        // @todo: use constant for `rpcUrl`
        // walletconnect: { rpcUrl: '' }
      }}>
      <GeistProvider themes={[light, dark]}>
        <CssBaseline />
        {children}
      </GeistProvider>
    </UseWalletProvider>
  </ReduxProvider>
);

export default Providers;
