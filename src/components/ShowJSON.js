import React from "react";
import styles from "./ShowJSON.module.scss";

export function ShowJSON(props) {
  //   const data = props.children ?? undefined;
  // check if props.children is an array
  const isObject = typeof props.children === "object"; // && !Array.isArray(props.children);

  const isArray = Array.isArray(props.children);

  function downloadObject() {
    if (!isObject) return;
    const json = JSON.stringify(props.children, undefined, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${props.title || "data"}.json`;
    a.href = url;
    a.click();
  }

  function downloadArray() {
    if (!isArray) return;
    if (props.children.length === 0) return;
    const keys = Object.keys(props.children[0]);
    const csv = props.children.map((row) =>
      // keys.map((k) => JSON.stringify(row[k])).join(",")

      keys.map((k) => `"${row[k]}"`).join(",")
    );
    csv.unshift(keys.join(","));
    const csvString = csv.join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${props.title || "data"}.csv`;
    a.href = url;
    a.click();
  }

  return (
    <>
      <div className={styles.title}>
        {props.title}
        {isObject && <button onClick={downloadObject}>⬇ JSON</button>}
        {isArray && <button onClick={downloadArray}>⬇ CSV</button>}
      </div>
      <pre className={styles.body}>
        {JSON.stringify(props.children, undefined, 2)}
      </pre>
    </>
  );
}
