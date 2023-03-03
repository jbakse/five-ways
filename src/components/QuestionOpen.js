import React, { useEffect, useRef } from "react";
import { clamp, smoothstep } from "../lib/util";
import styles from "./QuestionOpen.module.scss";

export function QuestionOpen({ prompt, responseTexts, animationTime = 5000 }) {
  const scroller = useRef();
  useEffect(() => {
    const startTime = Date.now();

    const scroll = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const n = smoothstep(clamp(elapsedTime / animationTime, 0, 1));

      if (scroller.current) {
        scroller.current.scrollTop =
          (scroller.current.scrollHeight - scroller.current.clientHeight) * n;
      }
    };

    const interval = setInterval(scroll, 1000 / 60);

    return () => clearInterval(interval);
  }, [animationTime]);

  return (
    <div className={styles.QuestionOpen}>
      <div className={styles.PromptWrap}>
        <h1>{prompt}</h1>
      </div>
      <div className={styles.ResponsesWrap}>
        <div className={styles.ResponsesScroll} ref={scroller}>
          {responseTexts.map((text) => (
            <div key={text} className={styles.Response}>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
