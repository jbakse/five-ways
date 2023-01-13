import React from "react";
import styles from "./Table.module.scss";

export function Table({ columns, data }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key || c.field}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row) => (
          <tr key={row.id}>
            {columns.map((c) => (
              <td
                key={c.key || c.field}
                onClick={() => c.onClick?.(row)}
                className={c.onClick && styles.clickable}
              >
                {c.formatter ? c.formatter(row[c.field]) : row[c.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
