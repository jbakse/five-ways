import React from "react";
import styles from "./Async.module.scss";

export function Async(props) {
  if (props.data.loading) {
    return (
      <div className={`${props.className} ${styles.loading}`}>Loading...</div>
    );
  }
  if (props.data.error) {
    return (
      <div className={`${props.className} ${styles.error}`}>
        Error: {props.data.error.message}
      </div>
    );
  }
  return <div className={props.className}>{props.children}</div>;
}
