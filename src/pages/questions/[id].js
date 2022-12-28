import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import { Async } from "../../components/Async";
import { ShowJSON } from "../../components/ShowJSON";
import {
  useAsyncQuestion,
  useAsyncResponses,
  useResultSummary,
} from "../../lib/hooks";

export default function QuestionPage(/*props*/) {
  const router = useRouter();

  // todo: could/should this be a getServersideProp? yes, probably
  const question = useAsyncQuestion(router.query.id);
  const responses = useAsyncResponses(router.query.id);
  const summary = useResultSummary(question, responses);

  return (
    <>
      <Head>
        <title>Question</title>
      </Head>

      {/* <Async data={summary}>
        <ResultSlide data={summary}></ResultSlide>
      </Async> */}

      <Async className="content-block" data={question}>
        <h1 className="content-block">Question "{question.value?.nickname}"</h1>

        <Link
          href={`/responses?questionId=${encodeURIComponent(
            question.value?.id
          )}&startDate=2000-01-01&endDate=3000-01-01`}
        >
          responses
        </Link>
      </Async>

      <Async className="content-block" data={summary}>
        <ShowJSON title={`${question.value?.nickname}_report`}>
          {summary}
        </ShowJSON>
      </Async>
      <Async className="content-block" data={question}>
        <ShowJSON title={`${question.value?.nickname}_export`}>
          {question.value}
        </ShowJSON>
      </Async>
      {/* <Async className="content-block" data={responses}>
        <ShowJSON title={`responses_${question.value?.nickname}`}>
          {responses.value}
        </ShowJSON>
      </Async> */}
    </>
  );
}
