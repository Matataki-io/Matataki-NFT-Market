import type { AppProps /*, AppContext */ } from "next/app";
import { GeistProvider, CssBaseline } from '@geist-ui/react'
import 'inter-ui/inter.css'
// import { useState } from "react";

// import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>;
}

export default MyApp;
