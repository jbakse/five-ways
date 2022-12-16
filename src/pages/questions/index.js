import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useAsync } from "react-use";
import { Async } from "../../components/Async";
import { Table } from "../../components/Table";

export default function QuestionsIndex(/*props*/) {
  const questions = useAsync(async () => {
    const response = await fetch(`/api/questions`);
    const result = await response.json();

    return result.questions;
  }, []);

  const columns = [
    // configure table columns
    { header: "nickname", field: "nickname" },
    { header: "surveys", field: "Surveys", formatter: (a) => a?.length },
    { header: "type", field: "type" },
    {
      header: "prompt",
      field: "prompt",
      formatter: (s) => s.slice(0, 20) + "...",
    },
    // { header: "updated", field: "updated", formatter: formatDate },
    {
      header: "details",
      field: "id",
      key: "details",
      formatter: (id) => (
        <Link href={`/questions/${encodeURIComponent(id)}`}>details</Link>
      ),
    },
    {
      header: "responses",
      field: "id",
      key: "responses",
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
      <h1 className="content-block">Questions</h1>

      <Async className="content-block" data={questions}>
        <Table columns={columns} data={questions.value} />
      </Async>
    </>
  );
}
