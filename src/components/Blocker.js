import React from "react";
import styles from "./Blocker.module.scss";

export function Blocker({ hidden }) {
  return (
    <div
      className={`${styles.Blocker} ${hidden ? styles.hidden : ""}`}
      style={{
        backgroundColor: `#d5d6d7`,
      }}
    ></div>
  );
}
