import React from "react";
import { useAsync } from "react-use";
import Head from "next/head";

export default function Surveys(/*props*/) {
  const survey = useAsync(async () => {
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
      {survey.loading ? (
        <div>Loading...</div>
      ) : survey.error ? (
        <div>Error: {survey.error.message}</div>
      ) : (
        <pre>{JSON.stringify(survey.value, null, 2)}</pre>
      )}
    </>
  );
}
