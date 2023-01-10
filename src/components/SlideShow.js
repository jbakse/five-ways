import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./SlideShow.module.scss";

export default function SlideShow(props) {
  const children = props.children.flat();

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
          currentSlide + 1 === children.length && styles.hidden
        )}
        onClick={next}
      >
        →
      </button>

      <button
        className={classNames(
          styles.SlideShow__Finish,
          currentSlide + 1 !== children.length && styles.hidden
        )}
        onClick={finish}
      >
        ↑
      </button>

      <ProgressBar percent={(currentSlide / children.length) * 100} />
      {/* <div className={styles.SlideShow__Info}>
        {currentSlide + 1} / {children.length}
      </div> */}

      {children.map((child, index) => (
        <div
          className={styles.SlideShow__Slide}
          id={`slide-${index}`}
          key={child.key}
        >
          {child}
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
