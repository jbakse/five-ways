import React, { useEffect, useState } from "react";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { getSurveyDeep } from "../lib/airtable";
import Question from "../components/Question";
import styles from "./survey.module.scss";

export async function getServerSideProps(/*context*/) {
  const surveyId = "recVZKGGAb7BaWPvf"; //TODO: make configurable
  return {
    props: {
      survey: await getSurveyDeep(surveyId),
    },
  };
}

export default function TakeSurveyPage(props) {
  const [responderId] = useState(uuidv4());

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <SlideShow>
        {props.survey.questions.map((q) => (
          <Question
            responderId={responderId}
            surveyId={props.survey.id}
            {...q}
            key={q.id}
          />
        ))}
      </SlideShow>

      {/* <div className={classNames(styles.survey, styles.SlideShow)}>
        <button className={styles.SlideShow__Next}>Next</button>
        {props.survey.questions.map((q) => (
          <div className={styles.SlideShow__Slide} key={q.id}>
            <Question
              responderId={responderId}
              surveyId={props.survey.id}
              {...q}
              // key={q.id}
            />
          </div>
        ))}
      </div> */}
    </>
  );
}

function SlideShow(props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  function next() {
    console.log("next");
    setCurrentSlide(Math.min(props.children.length - 1, currentSlide + 1));
  }

  function previous() {
    console.log("previous");
    setCurrentSlide(Math.max(0, currentSlide - 1));
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
      <button className={styles.SlideShow__Previous} onClick={previous}>
        Previous
      </button>
      <button className={styles.SlideShow__Next} onClick={next}>
        Next
      </button>
      <div className={styles.SlideShow__Info}>
        {currentSlide + 1} / {props.children.length}
      </div>
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
