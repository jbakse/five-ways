import React from "react";
import Link from "next/link";
import { useAsync } from "react-use";
import Head from "next/head";
import { Async } from "../../components/Async";
import { Table } from "../../components/Table";

export default function SurveysIndex(/*props*/) {
  const surveys = useAsync(async () => {
    const response = await fetch(`/api/surveys`);
    const result = await response.json();
    return result.surveys;
  }, []);

  const columns = [
    {
      header: "id",
      field: "id",
      formatter: (v) => (
        <Link href={`/surveys/${encodeURIComponent(v)}`}>{v}</Link>
      ),
    },
    { header: "nickname", field: "nickname" },
    { header: "questions", field: "questionCount" },
  ];

  return (
    <>
      <Head>
        <title>Surveys</title>
      </Head>
      <h1 className="content-block">Surveys</h1>
      <Async data={surveys}>
        <Table columns={columns} data={surveys.value} />
      </Async>
    </>
  );
}
