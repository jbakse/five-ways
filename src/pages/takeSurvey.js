import React, { useState } from "react";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { getSurveyDeep } from "../lib/airtable";
import Question from "../components/Question";
import SlideShow from "../components/SlideShow";

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
        <LanguageSelect />

        {props.survey.questions.map((q, index) => (
          <Question
            responderId={responderId}
            surveyId={props.survey.id}
            {...q}
            questionNumber={index + 1}
            key={q.id}
          />
        ))}
      </SlideShow>
    </>
  );
}

function LanguageSelect() {
  return (
    <div>
      <h1>Language Select</h1>
    </div>
  );
}
