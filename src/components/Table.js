import React from "react";
import styles from "./Table.module.scss";

export function Table({ columnConfig, data }) {
  return (
    <table className={styles.Table}>
      <thead>
        <tr>
          {columnConfig.map((c) => (
            <th key={c.key || c.field}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row) => (
          <tr key={row.id}>
            {columnConfig.map((c) => (
              <td
                key={c.key || c.field}
                onClick={() => c.onClick?.(row)}
                className={c.onClick && styles.clickable}
              >
                {c.formatter ? c.formatter(row[c.field], row) : row[c.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
