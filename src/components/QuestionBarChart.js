import React from "react";
import { formatPercent } from "../lib/util";
import styles from "./QuestionBarChart.module.scss";

export function QuestionBarChart({ summary }) {
  if (!summary) return <></>;
  return (
    <div className={styles.QuestionBarChart}>
      <div className={styles.PromptWrap}>
        <h1>{summary.prompt}</h1>
      </div>
      <div className={styles.OptionsWrap}>
        {summary.options.map((option) => (
          <OptionBar key={option.index} option={option}></OptionBar>
        ))}
      </div>
    </div>
  );
}

function OptionBar({ option }) {
  return (
    <div className={styles.OptionBar}>
      <div
        className={styles.Filled}
        // style={{ width: `${option.percentOfAnswered * 100}%` }}
        style={{
          width: "100%",
          position: "absolute",
          left: `-${(1 - option.percentOfAnswered) * 100}%`,
        }}
      ></div>
      <div className={styles.Response}>{option.response}</div>
      <div className={styles.Percent}>
        {formatPercent(option.percentOfAnswered)}
      </div>
    </div>
  );
}
