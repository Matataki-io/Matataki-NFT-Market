// import { useState } from "react";
import type { AppProps /*, AppContext */ } from "next/app";
import NextHead from "next/head";
import { GeistProvider, CssBaseline } from '@geist-ui/react'
import { light, dark } from "../themes";
import 'inter-ui/inter.css'
import 'antd/dist/antd.css';

import "../styles/globals.css";
import Footer from "../components/Footer";
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GeistProvider themes={[light, dark]}>
      <NextHead>
        <title>Meta NFT Market</title>
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
      <CssBaseline />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </GeistProvider>
  );
}

export default MyApp;
