import React, { useState } from "react";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { getSurveyDeep } from "../lib/airtable";
import Question from "../components/Question";
import SlideShow from "../components/SlideShow";
import splash from "../components/Splash.module.scss";
import LanguageSelect from "../components/LanguageSelect";
import { useTimerReset } from "../lib/hooks";

export async function getServerSideProps({ res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=600"
  );

  const surveyId = "recVZKGGAb7BaWPvf"; //TODO: make configurable
  return {
    props: {
      survey: await getSurveyDeep(surveyId),
    },
  };
}

export default function TakeSurveyPage(props) {
  const [responderId] = useState(uuidv4());

  const [language, setLanguage] = useState("English");

  useTimerReset(5);

  return (
    <>
      <Head>
        <title>Survey</title>
        <link
          rel="preload"
          href="/fonts/MaxevilleTrial-Construct.otf"
          as="font"
          crossOrigin="anonymous"
        />
      </Head>
      <SlideShow>
        <Splash key="splash" />
        <LanguageSelect key="lang" setLanguage={setLanguage} />

        {props.survey.questions.map((q, index) => (
          <Question
            responderId={responderId}
            surveyId={props.survey.id}
            {...q}
            questionNumber={index + 1}
            key={q.id}
            language={language}
          />
        ))}
      </SlideShow>
    </>
  );
}

function Splash() {
  return (
    <div className={splash.Splash}>
      <h1>
        Make
        <br /> Sense
        <br /> of
        <br /> (This)
      </h1>
    </div>
  );
}
