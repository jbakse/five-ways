import React from "react";
import { useAsync } from "react-use";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Surveys(/*props*/) {
  const router = useRouter();
  const survey = useAsync(async () => {
    if (!router.query.id) return;
    const response = await fetch(`/api/surveys?id=${router.query.id}`);
    const result = await response.json();
    console.log(result);
    return result.questions;
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <h1>Survey {router.query.id}</h1>
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
