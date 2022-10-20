import React from "react";
import "../styles/reset.css";
import "../styles/global.css";
import "../styles/common.scss";
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
