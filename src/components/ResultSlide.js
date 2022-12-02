import React from "react";
import { PieChart } from "./PieChart";
import styles from "./ResultSlide.module.scss";

export function ResultSlide({ data }) {
  // if (!data) return <></>;

  //   data.options.sort((a, b) => b.count - a.count);
  //   // assign letter after sorting
  //   for (const [index, option] of data.options.entries()) {
  //     option.label = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index];
  //   }

  return (
    <>
      <div className={styles.Result}>
        <div className={styles.QuestionWrap}>
          <h1>{data.prompt}</h1>
          {data.options.map((option) => (
            <div key={option.index} className={styles.Option}>
              {option.response}&nbsp;
            </div>
          ))}
        </div>
        <div className={styles.ChartWrap}>
          <PieChart data={data.options.map((d) => d.count)} />
        </div>
      </div>
    </>
  );
}
