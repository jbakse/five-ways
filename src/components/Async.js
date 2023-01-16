import React from "react";
import styles from "./Async.module.scss";

export function Async({ data, children }) {
  if (data.loading) {
    return <div className={styles.LoadingMessage}>Loading...</div>;
  }
  if (data.error) {
    return (
      <div className={styles.ErrorMessage}>Error: {data.error.message}</div>
    );
  }
  return <>{children}</>;
}
