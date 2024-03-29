import React, { useState } from "react";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { Mumbai } from '@thirdweb-dev/chains'
import Head from "next/head";
import ThirdwebGuideFooter from "../components/guide/ThirdwebGuideFooter";
import "../styles/globals.css";
import { Header } from "../components/Header"
// import { Footer } from "./Footer"



// This is the chainId your dApp will work on.
// const activeChainId = ChainId.Polygon;

function MyApp({ Component, pageProps }: AppProps) {

  const [changeLan, setchangeLan] = useState(true);

  return (
    <ThirdwebProvider activeChain={Mumbai}
    clientId="c63fd3dcf8c9eec46c253e543b0ff569" >
      <div className="setchangeLang">
        {changeLan ? (
          <button
            className="changelang"
            onClick={() => {
              setchangeLan(false);
            }}
          >
            English
          </button>
        ) : (
          <button
            className="changelang"
            onClick={() => {
              setchangeLan(true);
            }}
          >
            Italiano
          </button>
        )}
      </div>
      <Component {...pageProps} changeLan={changeLan} />
      {/* <Footer /> */}
    </ThirdwebProvider>
  );
}

export default MyApp;
