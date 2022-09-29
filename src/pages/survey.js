import React, { useState } from "react";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { getQuestions } from "../lib/airtable";
import Question from "../components/Question";
import styles from "./survey.module.scss";

export async function getServerSideProps(/*context*/) {
  const surveyId = "recVZKGGAb7BaWPvf"; //TODO: make configurable
  return {
    props: {
      surveyId,
      questions: await getQuestions(surveyId),
    },
  };
}

export default function Survey(props) {
  const [responderId] = useState(uuidv4());

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <div className={styles.survey}>
        {props.questions.map((q) => (
          <Question
            responderId={responderId}
            surveyId={props.surveyId}
            {...q}
            key={q.id}
          />
        ))}
      </div>
    </>
  );
}
