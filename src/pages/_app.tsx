import type { AppProps /*, AppContext */ } from "next/app";
import { GeistProvider, CssBaseline } from '@geist-ui/react'
import { light, dark } from "../themes";
import 'inter-ui/inter.css'
// import { useState } from "react";

import "../styles/globals.css";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return <GeistProvider themes={[ light, dark ]}>
    <CssBaseline />
    <Header />
    <Component {...pageProps} />
    <Footer />
    </GeistProvider>;
}

export default MyApp;
