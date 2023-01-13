import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useAsync } from "react-use";
import { Async } from "../../components/Async";
import { Table } from "../../components/Table";

export default function QuestionsIndex(/*props*/) {
  const questions = useAsync(async () => {
    // review should this be serversideprops?
    const response = await fetch(`/api/questions`);
    const result = await response.json();
    // review error handling?
    return result.questions;
  }, []);

  const columns = [
    // configure table columns
    {
      header: "nickname",
      field: "nickname",
    },
    {
      header: "surveys",
      field: "Surveys",
      formatter: (a) => a?.length,
    },
    {
      header: "type",
      field: "type",
    },
    {
      header: "prompt",
      field: "prompt",
      formatter: (s) => s.slice(0, 20) + "...",
    },
    {
      key: "details",
      header: "details",
      field: "id",
      formatter: (id) => (
        <Link href={`/questions/${encodeURIComponent(id)}`}>details</Link>
      ),
    },
    {
      key: "responses",
      header: "responses",
      field: "id",
      formatter: (id) => (
        <Link
          href={`/responses?questionId=${encodeURIComponent(
            id
          )}&startDate=2000-01-01&endDate=3000-01-01`}
        >
          responses
        </Link>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Questions</title>
      </Head>

      <div className="content-block">
        <h1>Questions</h1>

        <Async data={questions}>
          <Table columns={columns} data={questions.value} />
        </Async>
      </div>
    </>
  );
}
