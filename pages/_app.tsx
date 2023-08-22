import React, { useEffect } from "react";
import App from "next/app";
import Head from "next/head";
import "../styles/globals.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    const Layout =
      Component.layout ||
      (({ children }: { children: JSX.Element }) => <>{children}</>);

    return (
      <React.Fragment>
        <Head>
          <title>Vendor | Live Decor</title>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnHover={false}
        />
      </React.Fragment>
    );
  }
}
