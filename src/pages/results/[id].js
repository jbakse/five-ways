import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Async } from "../../components/Async";
import { ShowJSON } from "../../components/ShowJSON";
import { ResultSlide } from "../../components/ResultSlide";
import {
  useAsyncQuestion,
  useAsyncResponses,
  useResultSummary,
} from "../../lib/hooks";

export default function ResultPage(/*props*/) {
  const router = useRouter();

  const question = useAsyncQuestion(router.query.id);
  const responses = useAsyncResponses(router.query.id);
  const summary = useResultSummary(question, responses);

  return (
    <>
      <Head>
        <title>Results</title>
      </Head>
      <Async data={summary}>
        <ResultSlide data={summary}></ResultSlide>
      </Async>
      <Async data={summary}>
        <ShowJSON title={`report_${question.value?.nickname}`}>
          {summary}
        </ShowJSON>
      </Async>
      <Async className="content-block" data={question}>
        <ShowJSON title={`question_${question.value?.nickname}`}>
          {question.value}
        </ShowJSON>
      </Async>
      <Async className="content-block" data={responses}>
        <ShowJSON title={`responses_${question.value?.nickname}`}>
          {responses.value}
        </ShowJSON>
      </Async>
    </>
  );
}
