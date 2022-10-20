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
        {props.survey.questions.map((q) => (
          <Question
            responderId={responderId}
            surveyId={props.survey.id}
            {...q}
            key={q.id}
          />
        ))}
      </SlideShow>
    </>
  );
}
