import React from 'react';
import { GeistProvider } from '@geist-ui/react';
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
        walletconnect: {
          rpcUrl: process.env.NEXT_PUBLIC_USE_WALLET_WC_RPC as string,
        },
      }}>
      <GeistProvider themes={[light, dark]}>{children}</GeistProvider>
    </UseWalletProvider>
  </ReduxProvider>
);

export default Providers;
