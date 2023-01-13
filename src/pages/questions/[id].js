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

  // review: should this be a getServersideProp?
  // data depends on query id only, and can't be changed from this page
  // i think serverSideProps is better then, double check
  // is there a good article on when to use?

  const question = useAsyncQuestion(router.query.id);
  const responses = useAsyncResponses(router.query.id);
  const summary = useResultSummary(question, responses);

  return (
    <>
      <Head>
        <title>Question</title>
      </Head>
      <div className="content-block">
        <Async data={question}>
          <h1>Question "{question.value?.nickname}"</h1>

          <Link
            href={`/responses?questionId=${encodeURIComponent(
              question.value?.id
            )}&startDate=2000-01-01&endDate=3000-01-01`}
          >
            responses
          </Link>
        </Async>

        <Async data={summary}>
          <ShowJSON
            title={`${question.value?.nickname}_report`}
            data={summary}
          ></ShowJSON>
        </Async>

        <Async data={question}>
          <ShowJSON
            title={`${question.value?.nickname}_export`}
            data={question.value}
          ></ShowJSON>
        </Async>
      </div>
    </>
  );
}
