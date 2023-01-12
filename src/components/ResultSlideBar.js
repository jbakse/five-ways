import React from "react";
import { formatPercent } from "../lib/util";
import styles from "./ResultSlideBar.module.scss";

export function ResultSlideBar({ data }) {
  if (!data) return <></>;
  return (
    <>
      <div className={styles.ResultSlide}>
        <div className={styles.QuestionWrap}>
          <h1>{data.prompt}</h1>
        </div>
        <div className={styles.OptionWrap}>
          {data.options.map((option) => (
            <div key={option.index} className={styles.Option}>
              <div
                className={styles.Bar}
                style={{ width: `${option.percentOfAnswered * 100}%` }}
              ></div>
              <div className={styles.Response}>{option.response}</div>
              <div className={styles.Percent}>
                {formatPercent(option.percentOfAnswered)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
