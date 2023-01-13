import React from "react";
import { downloadArrayAsCSV, downloadObjectAsJSON } from "../lib/util";
import styles from "./ShowJSON.module.scss";

export function ShowJSON({ title, data }) {
  const isObject = typeof data === "object";
  const isArray = Array.isArray(data);

  return (
    <>
      {/* header */}
      <div className={styles.title}>
        {title}
        {isObject && (
          <button onClick={() => downloadObjectAsJSON(title, data)}>
            ⬇ JSON
          </button>
        )}
        {isArray && (
          <button onClick={() => downloadArrayAsCSV(title, data)}>⬇ CSV</button>
        )}
      </div>

      {/* body */}
      <pre className={styles.body}>{JSON.stringify(data, undefined, 2)}</pre>
    </>
  );
}
