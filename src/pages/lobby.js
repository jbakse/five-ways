import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { getSurveyDeep, getConfiguration } from "../lib/airtable";
import { useAsyncResponses, useResultSummary } from "../lib/hooks";
import { ResultSlide } from "../components/ResultSlide";
import { useBodyClass } from "../lib/hooks";

export async function getServerSideProps({ res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=600"
  );

  // const surveyId = "recVZKGGAb7BaWPvf"; //TODO: make configurable

  const config = await getConfiguration();
  console.log("config", config);

  return {
    props: {
      config,
      survey: await getSurveyDeep(config.lobbySurveyId),
    },
  };
}

export default function LobbyPage(props) {
  console.log("LobbyPage", props.config.lobbySlideTime);

  useBodyClass("no-scroll");

  const [questionIndex, setQuestionIndex] = useState(0);
  // console.log("lst", props.config.lobbySlideTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionIndex((index) => (index + 1) % props.survey.questions.length);
    }, props.config.lobbySlideTime * 1000);
    return () => clearInterval(interval);
  }, [props.survey.questions.length, props.config.lobbySlideTime]);

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <Black></Black>
      <QuestionCard
        question={props.survey.questions[questionIndex]}
        visibleSeconds={props.config.lobbySlideTime - 2}
      />
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
function QuestionCard({ question, visibleSeconds }) {
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
        <ResultSlide
          data={summary}
          visibleSeconds={visibleSeconds}
        ></ResultSlide>
      )}
    </>
  );
}
