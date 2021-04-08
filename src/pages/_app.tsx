import React, { useState, useEffect } from 'react';
import type { AppProps /*, AppContext */ } from 'next/app';
import NextHead from 'next/head';
import { light, dark } from '../themes';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Create from '../components/Create';
import Profile from '../components/Profile';

import '../styles/globals.css';
import 'inter-ui/inter.css';
import 'antd/dist/antd.css';

import Providers from '../providers';

function MyApp({ Component, pageProps }: AppProps) {
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isProfile, setIsProfile] = useState<boolean>(false);

  useEffect(() => {
    console.log('pageProps', pageProps);
  });

  return (
    <Providers>
      <NextHead>
        <title>Meta NFT Market</title>
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
