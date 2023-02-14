import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./SlideShow.module.scss";

export default function SlideShow({ children }) {
  children = children.flat();

  const slideShow = React.createRef();

  const [currentSlide, setCurrentSlide] = useState(0);

  function previous() {
    setCurrentSlide(Math.max(0, currentSlide - 1));
  }

  function next() {
    setCurrentSlide(Math.min(children.length - 1, currentSlide + 1));
  }

  function finish() {
    window.location.reload();
  }

  // scroll on button press
  useEffect(() => {
    const slide = document.querySelector(`#slide-${currentSlide}`);

    if (slide) {
      slide.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
      // older browsers might support scrollIntoView
      // but not the smooth behavior, causing no scroll at all
      // detect this and scroll immediately
      const scrollBefore = slide.parentElement.scrollLeft;
      setTimeout(() => {
        const scrollAfter = slide.parentElement.scrollLeft;
        console.log(scrollBefore, scrollAfter);
        if (scrollBefore === scrollAfter) {
          slide.scrollIntoView();
        }
      }, 50);
    }
  }, [currentSlide]);

  // scroll on window resize
  useEffect(() => {
    function onResize() {
      const slide = document.querySelector(`#slide-${currentSlide}`);
      if (slide) {
        slideShow.current.scrollTo({
          top: 0,
          left: slide.offsetLeft,
          behavior: "instant",
        });
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [slideShow, currentSlide]);

  return (
    <div ref={slideShow} className={styles.SlideShow}>
      <button
        className={classNames(
          styles.Previous,
          currentSlide === 0 && styles.hidden
        )}
        onClick={previous}
      >
        ←
      </button>

      <button
        className={classNames(
          styles.Next,
          currentSlide + 1 === children.length && styles.hidden
        )}
        style={
          currentSlide === 0
            ? { paddingLeft: "30px", paddingRight: "30px" }
            : {}
        }
        onClick={next}
      >
        {currentSlide === 0 ? "Give Feedback" : ""} →
      </button>

      <button
        className={classNames(
          styles.Finish,
          currentSlide + 1 !== children.length && styles.hidden
        )}
        onClick={finish}
      >
        ↑
      </button>

      <ProgressBar percent={(currentSlide / (children.length - 1)) * 100} />

      {children.map((child, index) => (
        <div className={styles.Slide} id={`slide-${index}`} key={child.key}>
          {child}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div className={styles.ProgressBar}>
      <div
        style={{ width: `${percent}%` }}
        className={styles.ProgressBarFill}
      ></div>
    </div>
  );
}
