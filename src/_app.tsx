// import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

const StrideApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Resume World</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default StrideApp;
