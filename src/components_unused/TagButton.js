import React from "react";
import styles from "./TagButton.module.scss";

// TODO: not currently used

export function TagButton({ label, value, onClick }) {
  if (!value) return; // no button if no value

  return (
    <button className={styles.TagButton} onClick={onClick}>
      {label && `${label}: `}
      {value}
    </button>
  );
}
