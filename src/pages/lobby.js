import React, { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { getSurveyDeep, getConfiguration } from "../lib/airtable";
import { useAsyncResponses, useResultSummary } from "../lib/hooks";
import { ResultSlideBar } from "../components/ResultSlideBar";
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

  // open questions are not supported yet
  survey.questions = survey.questions.filter((q) => q.type !== "open");

  return {
    props: {
      config,
      survey,
    },
  };
}

export default function LobbyPage({ config, survey }) {
  useBodyClass("no-scroll");

  const [questionIndex, setQuestionIndex] = useState(0);
  const [blockerHidden, setBlockerHidden] = useState(true);

  useEffect(() => {
    if (!survey) return;

    function transition() {
      setBlockerHidden(false);

      setTimeout(() => {
        setQuestionIndex((index) => (index + 1) % survey.questions.length);
      }, 1000);

      setTimeout(() => {
        setBlockerHidden(true);
      }, 2000);
    }

    const interval = setInterval(() => {
      transition();
      // setQuestionIndex((index) => (index + 1) % survey.questions.length);
    }, config.lobbySlideTime * 1000);
    return () => clearInterval(interval);
  }, [survey, survey?.questions.length, config.lobbySlideTime]);

  if (!survey)
    return (
      <>
        <Head>
          <title>Survey</title>
        </Head>
        <Blocker hidden={true}></Blocker>
      </>
    );

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      {survey.questions[questionIndex].type === "slide" ? (
        <Slide images={survey.questions[questionIndex].images}></Slide>
      ) : (
        <QuestionCard question={survey.questions[questionIndex]} />
      )}
      <Blocker hidden={blockerHidden}></Blocker>
    </>
  );
}

function Slide({ images }) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Image
        src={images[0].src}
        alt={images[0].alt}
        layout="fill"
        objectPosition="center top"
        objectFit="contain"
      />
    </div>
  );
}
function QuestionCard({ question }) {
  // const question = useAsyncQuestion(question.id);
  const responses = useAsyncResponses(question.id);

  // refactor:
  // wrapping question in object as o.value is needed because
  // useResultSummary expects question param to be an async object
  // in the useAsync* format, refactor?

  const summary = useResultSummary({ value: question }, responses);

  return (
    <>
      {!summary.error && !summary.loading && (
        <ResultSlideBar data={summary}></ResultSlideBar>
      )}
    </>
  );
}
