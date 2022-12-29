import React, { useRef, useEffect } from "react";
import { PieChart } from "./PieChart";
import styles from "./ResultSlide.module.scss";

export function ResultSlide({ data, visibleSeconds = 5 }) {
  // todo: would be nice to pull the timing callbacks up to the parent
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
