import type { AppProps /*, AppContext */ } from "next/app";
import NextHead from "next/head";
import 'inter-ui/inter.css'
// import { useState } from "react";

import "../styles/globals.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Providers from "../providers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <NextHead>
        <title>Meta NFT Market</title>
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </Providers>
  );
}

export default MyApp;
