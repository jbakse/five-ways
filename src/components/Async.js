import React from "react";
import styles from "./Async.module.scss";

export function Async(props) {
  if (props.data.loading) {
    return <div className={`content-block ${styles.loading}`}>Loading...</div>;
  }
  if (props.data.error) {
    return (
      <div className={`content-block ${styles.error}`}>
        Error: {props.data.error.message}
      </div>
    );
  }
  return <div className="content-block">{props.children}</div>;
}
