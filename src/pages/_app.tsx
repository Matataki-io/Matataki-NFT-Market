import React, { useState } from 'react';
import type { AppProps /*, AppContext */ } from 'next/app';
import NextHead from 'next/head';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { light, dark } from '../themes';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Create from '../components/Create';

import '../styles/globals.css';
import 'inter-ui/inter.css';
import 'antd/dist/antd.css';

import Providers from '../providers';

function MyApp({ Component, pageProps }: AppProps) {
  const [isCreate, setIsCreate] = useState<Boolean>(false);

  return (
    <Providers>
      <NextHead>
        <title>Meta NFT Market</title>
        <link rel='icon' href='/favicon.ico' />
      </NextHead>
      <CssBaseline />
      {isCreate ? <Create setIsCreate={setIsCreate}></Create> : ''}
      <Header isCreate={isCreate} setIsCreate={setIsCreate} />
      <Component {...pageProps} />
      <Footer />
    </Providers>
  );
}

export default MyApp;
