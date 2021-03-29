import type { AppProps /*, AppContext */ } from "next/app";
import { GeistProvider, CssBaseline } from '@geist-ui/react'
import { light, dark } from "../themes";
import 'inter-ui/inter.css'
// import { useState } from "react";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <GeistProvider themes={[ light, dark ]}>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>;
}

export default MyApp;
