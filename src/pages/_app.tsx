import React, { useState, useEffect } from 'react';
import type { AppProps /*, AppContext */ } from 'next/app';
import NextHead from 'next/head';
import { light, dark } from '../themes';
import { BackTop } from 'antd';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Create from '../components/Create';
import Profile from '../components/Profile';
import ApplicationBtn from '../components/Application/Btn';

import { removeCookie } from '../utils/cookie';

import '../styles/globals.css';
import 'antd/dist/antd.css';
// Token list custom styles
import '../styles/TokenList.scss';

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

  let comment = `
  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js" integrity="sha256-3Jy/GbSLrg0o9y5Z5n1uw0qxZECH7C6OQpVBgNFYa0g=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js" integrity="sha256-g6iAfvZp+nDQ2TdTR/VVKJf3bGro4ub5fvWSWVRi2NE=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-shim.min.js" integrity="sha256-8E4Is26QH0bD52WoQpcB+R/tcWQtpzlCojrybUd7Mxo=" crossorigin="anonymous"></script>
  <![endif]-->`;

  const metaTitle = 'Matataki NFT';
  const metaDescription = 'Matataki NFT 交易市场';
  const metaKeywords =
    'NFT、MTTK NFT、NFT Market、NFT 交易市场、Matataki、瞬MATATAKI、仙女座科技、小岛美奈子、岛娘';
  const metaImage =
    'https://ssimg.frontenduse.top/article/2021/06/30/4cd78197b0ebf60abc5e54c04fee6770.png';

  return (
    <Providers>
      <NextHead>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />

        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-title' content={metaTitle} />

        <meta name='robots' property='robots' content='index,follow' />
        <meta
          name='copyright'
          property='copyright'
          content='Copyright © 2018-2021 ANDOROMEDA TECH.ltd'
        />
        <meta name='description' content={metaDescription} />
        <meta name='keywords' content={metaKeywords} />
        <meta name='twitter:card' property='twitter:card' content='summary' />
        <meta name='twitter:site' property='twitter:site' content={metaTitle} />
        <meta
          name='twitter:title'
          property='twitter:title'
          content={metaTitle}
        />
        <meta
          name='twitter:image'
          property='twitter:image'
          content={metaImage}
        />
        <meta
          name='twitter:description'
          property='twitter:description'
          content={metaDescription}
        />
        <meta name='og:type' property='og:type' content='website' />
        <meta name='og:site_name' property='og:site_name' content={metaTitle} />
        <meta name='og:title' property='og:title' content={metaTitle} />
        <meta name='og:image' property='og:image' content={metaImage} />
        <meta
          name='og:description'
          property='og:description'
          content={metaDescription}
        />
      </NextHead>
      <div dangerouslySetInnerHTML={{ __html: comment }} />
      {isCreate ? <Create setIsCreate={setIsCreate}></Create> : ''}
      <Profile isProfile={isProfile} setIsProfile={setIsProfile}></Profile>
      <Header
        isCreate={isCreate}
        setIsCreate={setIsCreate}
        setIsProfile={setIsProfile}
      />
      <Component {...pageProps} setIsProfile={setIsProfile} />
      <ApplicationBtn></ApplicationBtn>
      <BackTop />
      <Footer />
    </Providers>
  );
}

export default MyApp;
