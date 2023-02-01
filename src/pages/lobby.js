import React, { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { getSurveyDeep, getConfiguration } from "../lib/airtable";
import { useAsyncResponses, useResultSummary } from "../lib/hooks";
import { QuestionBarChart } from "../components/QuestionBarChart";
import { QuestionOpen } from "../components/QuestionOpen";
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
    // remove slides with unknown type
    survey.questions = survey.questions.filter(
      (q) =>
        q.type === "single" ||
        q.type === "multiple" ||
        q.type === "slide" ||
        q.type === "open"
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
      {question.type === "open" && (
        <QuestionCard
          question={question}
          animationTime={config.lobbySlideTime * 1000 - 1000}
        />
      )}

      <Blocker hidden={!showBlocker}></Blocker>
    </>
  );
}

function QuestionCard({ question, animationTime = 5000 }) {
  const responses = useAsyncResponses(question.id);
  const summary = useResultSummary({ value: question }, responses);

  if (summary.error) return;
  if (summary.loading) return;

  if (question.type === "open") {
    const responseTexts = responses.value
      .filter((r) => r.published)
      .map((r) => r.response);
    const prompt = summary.prompt;
    return (
      <QuestionOpen
        prompt={prompt}
        responseTexts={responseTexts}
        animationTime={animationTime}
      />
    );
  }
  if (question.type === "single" || question.type === "multiple")
    return <QuestionBarChart summary={summary}></QuestionBarChart>;

  // review: useAsync result object format
  // wrapping question in object as o.value is needed because
  // useResultSummary expects question param to be an async object
  // in the useAsync* format, refactor?
  // this submodule could mabye be inlined if useAsyncResponses and useResultSummary handled question.type === "slide" (etc) well
  // inlining would be best done after reconsidering all of the above
}
