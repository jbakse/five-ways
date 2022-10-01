import React from "react";
import Link from "next/link";
import { useAsync } from "react-use";
import Head from "next/head";
import { Async } from "../../components/Async";

export default function Surveys(/*props*/) {
  const surveys = useAsync(async () => {
    const response = await fetch(`/api/surveys`);
    const result = await response.json();
    console.log(result);
    return result.surveys;
  }, []);
  return (
    <>
      <Head>
        <title>Surveys</title>
      </Head>
      <h1>Surveys</h1>
      <Async data={surveys}>
        <table className="table">
          <thead>
            <tr>
              <th>id</th>
              <th>nickname</th>
              <th>questions</th>
            </tr>
          </thead>
          <tbody>
            {surveys.value?.map((s) => (
              <tr key={s.id}>
                <td>
                  <Link href={`/surveys/${encodeURIComponent(s.id)}`}>
                    {s.id}
                  </Link>
                </td>
                <td>{s.nickname}</td>
                <td>{s.questionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Async>
    </>
  );
}
