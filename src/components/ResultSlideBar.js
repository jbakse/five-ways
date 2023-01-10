import React, { useRef, useEffect } from "react";
import { formatPercent } from "../lib/util";
import styles from "./ResultSlideBar.module.scss";

export function ResultSlideBar({ data, visibleSeconds = 5 }) {
  // review: lobby slide show clock
  // would be nice to pull the timing callbacks up to the parent
  // tried a couple appraoches (passing a class and forwardRef) but they
  // were looking messy. They might work if rethought. revist.

  const slide = useRef(null);

  useEffect(() => {
    const enter = setTimeout(() => {
      slide.current.classList.add(styles.in);
    }, 1);

    const exit = setTimeout(() => {
      slide.current.classList.remove(styles.in);
    }, visibleSeconds * 1000);

    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
    };
  }, [visibleSeconds]);

  if (!data) return <></>;
  return (
    <>
      <div ref={slide} className={styles.ResultSlide}>
        <div className={styles.QuestionWrap}>
          <h1>{data.prompt}</h1>
        </div>
        <div className={styles.OptionWrap}>
          {data.options.map((option) => (
            <div key={option.index} className={styles.Option}>
              {/* {JSON.stringify(option)} */}
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
