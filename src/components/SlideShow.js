import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./SlideShow.module.scss";

export default function SlideShow(props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  function previous() {
    console.log("previous");
    setCurrentSlide(Math.max(0, currentSlide - 1));
  }

  function next() {
    console.log("next");
    setCurrentSlide(Math.min(props.children.length - 1, currentSlide + 1));
  }

  function finish() {
    console.log("finish");
  }

  useEffect(() => {
    console.log("scroll to", currentSlide);
    const slide = document.getElementById(`slide-${currentSlide}`);
    if (slide) {
      slide.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, [currentSlide]);

  return (
    <div className={styles.SlideShow}>
      <button
        className={classNames(
          styles.SlideShow__Previous,
          currentSlide === 0 && styles.hidden
        )}
        onClick={previous}
      >
        ←
      </button>

      <button
        className={classNames(
          styles.SlideShow__Next,
          currentSlide + 1 === props.children.length && styles.hidden
        )}
        onClick={next}
      >
        →
      </button>

      <button
        className={classNames(
          styles.SlideShow__Finish,
          currentSlide + 1 !== props.children.length && styles.hidden
        )}
        onClick={finish}
      >
        ↑
      </button>

      <ProgressBar percent={(currentSlide / props.children.length) * 100} />
      {/* <div className={styles.SlideShow__Info}>
        {currentSlide + 1} / {props.children.length}
      </div> */}

      {props.children.map((child, i) => (
        <div
          className={styles.SlideShow__Slide}
          id={`slide-${i}`}
          key={child.key}
        >
          {" "}
          {child}{" "}
        </div>
      ))}
    </div>
  );
}

function ProgressBar(props) {
  return (
    <div className={styles.Slideshow__ProgressBar}>
      <div
        style={{ width: `${props.percent}%` }}
        className={styles.Slideshow__ProgressBarFill}
      ></div>
    </div>
  );
}
