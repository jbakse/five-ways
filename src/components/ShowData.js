import React from "react";
import { downloadArrayAsCSV, downloadObjectAsJSON } from "../lib/util";
import styles from "./ShowData.module.scss";

export function ShowData({ title, data }) {
  const isObject = typeof data === "object";
  const isArray = Array.isArray(data);

  return (
    <div className={styles.ShowData}>
      {/* header */}
      <div className={styles.Title}>
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
      <pre className={styles.Body}>{JSON.stringify(data, undefined, 2)}</pre>
    </div>
  );
}
