import React, { useEffect, useRef } from "react";
import { PieChart } from "./PieChart";
import styles from "./ResultSlide.module.scss";

export function ResultSlide({ data }) {
  // if (!data) return <></>;

  //   data.options.sort((a, b) => b.count - a.count);
  //   // assign letter after sorting
  //   for (const [index, option] of data.options.entries()) {
  //     option.label = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index];
  //   }

  const slide = useRef(null);

  useEffect(() => {
    const enter = setTimeout(() => {
      slide.current.classList.add(styles.in);
    }, 1);

    // todo: make timing configurable
    const exit = setTimeout(() => {
      slide.current.classList.remove(styles.in);
    }, 8000);

    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
    };
  }, []);

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
