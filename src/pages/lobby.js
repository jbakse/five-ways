import React, { useEffect, useState } from "react";
import Head from "next/head";
import { getSurveyDeep } from "../lib/airtable";
import { useAsyncResponses, useResultSummary } from "../lib/hooks";
import { ResultSlide } from "../components/ResultSlide";
import { useBodyClass } from "../lib/hooks";

export async function getServerSideProps(/*context*/) {
  const surveyId = "recVZKGGAb7BaWPvf"; //TODO: make configurable
  return {
    props: {
      survey: await getSurveyDeep(surveyId),
    },
  };
}

export default function LobbyPage(props) {
  useBodyClass("no-scroll");

  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionIndex((index) => (index + 1) % props.survey.questions.length);
    }, 10_000);
    return () => clearInterval(interval);
  }, [props.survey.questions.length]);

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <Black></Black>
      <QuestionCard question={props.survey.questions[questionIndex]} />
    </>
  );
}

function Black() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "black",
        zIndex: -1,
      }}
    ></div>
  );
}
function QuestionCard({ question }) {
  // const question = useAsyncQuestion(question.id);
  const responses = useAsyncResponses(question.id);

  // Todo:
  // wrapping question in object as o.value is needed because
  // useResultSummary expects question param to be an async object
  // in the useAsync* format, refactor?

  const summary = useResultSummary({ value: question }, responses);

  return (
    <>
      {!summary.error && !summary.loading && (
        <ResultSlide data={summary}></ResultSlide>
      )}
    </>
  );
}
