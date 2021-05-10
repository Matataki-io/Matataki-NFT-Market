import React, { useState, useEffect } from 'react';
import type { AppProps /*, AppContext */ } from 'next/app';
import NextHead from 'next/head';
import { light, dark } from '../themes';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Create from '../components/Create';
import Profile from '../components/Profile';

import { removeCookie } from '../utils/cookie';

import '../styles/globals.css';
import 'antd/dist/antd.css';

import Providers from '../providers';

function MyApp({ Component, pageProps }: AppProps) {
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isProfile, setIsProfile] = useState<boolean>(false);

  useEffect(() => {
    console.log('pageProps', pageProps);

    if (process.browser && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      ethereum.on('accountsChanged', (accounts: any) => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        console.log('accounts', accounts);

        removeCookie('token');
        (window as any).location.reload();
      });

      ethereum.on('chainChanged', (chainId: number) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        console.log('chainId', chainId);

        (window as any).location.reload();
      });
    }
  });

  return (
    <Providers>
      <NextHead>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        <link rel='icon' href='/favicon.ico' />
      </NextHead>
      {isCreate ? <Create setIsCreate={setIsCreate}></Create> : ''}
      <Profile isProfile={isProfile} setIsProfile={setIsProfile}></Profile>
      <Header
        isCreate={isCreate}
        setIsCreate={setIsCreate}
        setIsProfile={setIsProfile}
      />
      <Component {...pageProps} setIsProfile={setIsProfile} />
      <Footer />
    </Providers>
  );
}

export default MyApp;
