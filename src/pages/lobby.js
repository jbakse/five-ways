import React, { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { getSurveyDeep, getConfiguration } from "../lib/airtable";
import { useAsyncResponses, useResultSummary } from "../lib/hooks";
import { QuestionBarChart } from "../components/QuestionBarChart";
import { useBodyClass } from "../lib/hooks";
import { Blocker } from "../components/Blocker";

export async function getServerSideProps({ res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=600"
  );

  const config = await getConfiguration();
  const survey = config.lobbySurveyId
    ? await getSurveyDeep(config.lobbySurveyId)
    : null;

  if (survey) {
    // keep questions only if type is "single" or "multiple" or "slide"
    // "open" questions are not supported, other names unknown
    survey.questions = survey.questions.filter(
      (q) => q.type === "single" || q.type === "multiple" || q.type === "slide"
    );
  }

  return {
    props: {
      config,
      survey,
    },
  };
}

export default function LobbyPage({ config, survey }) {
  useBodyClass("no-scroll");

  // slideshow clock code, handles timed slide transitions
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showBlocker, setShowBlocker] = useState(false);

  useEffect(() => {
    if (!survey) return;

    function transition() {
      setShowBlocker(true);

      setTimeout(() => {
        setQuestionIndex((index) => (index + 1) % survey.questions.length);
      }, 1000);

      setTimeout(() => {
        setShowBlocker(false);
      }, 2000);
    }

    const interval = setInterval(() => {
      transition();
    }, config.lobbySlideTime * 1000);

    return () => clearInterval(interval);
  }, [survey, survey?.questions.length, config.lobbySlideTime]);

  // if there is no survey, show a blank page
  if (!survey)
    return (
      <>
        <Head>
          <title>Survey</title>
        </Head>
      </>
    );

  // if there is a survey show the current question
  const question = survey?.questions[questionIndex];
  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>

      {question.type === "slide" && (
        <Image
          src={question.images[0].src}
          alt={question.images[0].alt}
          layout="fill"
          objectPosition="center top"
          objectFit="contain"
        />
      )}

      {question.type === "single" && <QuestionCard question={question} />}

      {question.type === "multiple" && <QuestionCard question={question} />}

      <Blocker hidden={!showBlocker}></Blocker>
    </>
  );
}

function QuestionCard({ question }) {
  const responses = useAsyncResponses(question.id);
  const summary = useResultSummary({ value: question }, responses);

  return (
    <>
      {!summary.error && !summary.loading && (
        <QuestionBarChart data={summary}></QuestionBarChart>
      )}
    </>
  );

  // review: useAsync result object format
  // wrapping question in object as o.value is needed because
  // useResultSummary expects question param to be an async object
  // in the useAsync* format, refactor?
  // this submodule could mabye be inlined if useAsyncResponses and useResultSummary handled question.type === "slide" (etc) well
  // inlining would be best done after reconsidering all of the above
}
