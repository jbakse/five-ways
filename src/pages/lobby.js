import React from "react";
import Head from "next/head";
import { getSurveyDeep } from "../lib/airtable";
import SlideShow from "../components/SlideShow";
import { Async } from "../components/Async";
import { useAsyncResponses, useResultSummary } from "../lib/hooks";
import { ResultSlide } from "../components/ResultSlide";

export async function getServerSideProps(/*context*/) {
  const surveyId = "recVZKGGAb7BaWPvf"; //TODO: make configurable
  return {
    props: {
      survey: await getSurveyDeep(surveyId),
    },
  };
}

export default function LobbyPage(props) {
  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <SlideShow>
        {props.survey.questions.map((q) => (
          <QuestionCard surveyId={props.survey.id} question={q} key={q.id} />
        ))}
      </SlideShow>
    </>
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
      <Async data={summary}>
        <ResultSlide data={summary}></ResultSlide>
      </Async>
    </>
  );
}
