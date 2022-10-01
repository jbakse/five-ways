import React from "react";
import { useAsync } from "react-use";
import Head from "next/head";
import { useRouter } from "next/router";
import { Async } from "../../components/Async";

export default function Surveys(/*props*/) {
  const router = useRouter();
  const survey = useAsync(async () => {
    if (!router.query.id) return;
    const response = await fetch(`/api/surveys?id=${router.query.id}`);
    const result = await response.json();
    console.log(result);
    return result.survey;
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <h1>Survey {survey.value?.nickname}</h1>

      <Async data={survey}>
        {survey.value.questions.map((q) => (
          <h2 key={q.id}>{q.promptTextEnglish}</h2>
        ))}
        <pre>{JSON.stringify(survey?.value, null, 2)}</pre>
      </Async>
    </>
  );
}
