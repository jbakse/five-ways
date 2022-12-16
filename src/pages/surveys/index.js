import React from "react";
import Link from "next/link";
import Head from "next/head";
import { useAsync } from "react-use";
import { Async } from "../../components/Async";
import { Table } from "../../components/Table";

export default function SurveysIndex(/*props*/) {
  const surveys = useAsync(async () => {
    const response = await fetch(`/api/surveys`);
    const result = await response.json();
    return result.surveys;
  }, []);

  const columns = [
    // configure table columns
    { header: "nickname", field: "nickname" },

    { header: "questions", field: "questionCount" },
    // { header: "updated", field: "updated", formatter: formatDate },
    {
      header: "details",
      field: "id",
      key: "details",
      formatter: (v) => (
        <Link href={`/surveys/${encodeURIComponent(v)}`}>details</Link>
      ),
    },
    {
      header: "responses",
      field: "id",
      key: "responses",
      formatter: (id) => (
        <Link
          href={`/responses?surveyId=${encodeURIComponent(
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
        <title>Surveys</title>
      </Head>
      <h1 className="content-block">Surveys</h1>

      <Async className="content-block" data={surveys}>
        <Table columns={columns} data={surveys.value} />
      </Async>
    </>
  );
}
