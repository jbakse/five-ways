import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTimeout } from "../lib/hooks";
import { getSurveyDeep, getConfiguration } from "../lib/airtable";
import Question from "../components/Question";
import SlideShow from "../components/SlideShow";
import LanguageSelect from "../components/LanguageSelect";
import styles from "./takeSurvey.module.scss";

export async function getServerSideProps({ res, query }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=600"
  );

  const isGallery = "gallery" in query;
  const config = await getConfiguration();
  const surveyId = isGallery ? config.gallerySurveyId : config.homeSurveyId;
  const survey = surveyId ? await getSurveyDeep(surveyId) : null;

  if (survey) {
    // keep questions only if type is "single" or "multiple"
    // "open" and "slide" questions are not supported, other names unknown
    survey.questions = survey.questions.filter(
      (q) => q.type === "single" || q.type === "multiple"
    );
  }

  return {
    props: {
      config,
      survey,
    },
  };
}

export default function TakeSurveyPage(props) {
  const router = useRouter();

  useTimeout("gallery" in router.query ? props.config.galleryTimeout : false);

  const [language, setLanguage] = useState("English");

  const responderId = uuidv4();

  if (!props.survey) {
    return (
      <>
        <Head>Survey Closed</Head>
        <div className={styles.message}>
          <p>Sorry!</p>
          <p>The survey is currently closed.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>

      <SlideShow>
        <Welcome key="welcome" />

        <LanguageSelect key="lang" setLanguage={setLanguage} />

        {props.survey.questions.map((q, index) => (
          <Question
            key={q.id}
            responderId={responderId}
            surveyId={props.survey.id}
            questionNumber={index + 1}
            language={language}
            {...q}
          />
        ))}

        <ThankYou key="thankyou" />
      </SlideShow>
    </>
  );
}

function Welcome() {
  return (
    <div className={styles.message}>
      <h1>
        Make
        <br /> Sense
        <br /> of
        <br /> (This)
      </h1>
    </div>
  );
}

function ThankYou() {
  return (
    <div className={styles.message}>
      <p>Thank you!</p>
      <p>
        Your responses will help shape future exhibitions at the Walker. Take a
        look at the monitor in the gallery to see how your answers compare with
        others.
      </p>
    </div>
  );
}
