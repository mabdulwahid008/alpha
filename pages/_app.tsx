import React, { useState } from "react";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { Polygon } from '@thirdweb-dev/chains'
import Head from "next/head";
import ThirdwebGuideFooter from "../components/guide/ThirdwebGuideFooter";
import "../styles/globals.css";
import { Header } from "../components/Header"
// import { Footer } from "./Footer"
import Stake from './StarterStake'



// This is the chainId your dApp will work on.
// const activeChainId = ChainId.Polygon;

function MyApp({ Component, pageProps }: AppProps) {

  const [changeLan, setchangeLan] = useState(true);

  return (
    <ThirdwebProvider activeChain={Polygon}
    clientId="3772a2a8dd76298dcd6b0015731299d2" >
     
      <Stake />
      {/* <Component {...pageProps} changeLan={changeLan} /> */}
      {/* <Footer /> */}
    </ThirdwebProvider>
  );
}

export default MyApp;
