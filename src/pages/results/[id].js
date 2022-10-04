import React from "react";
import { useAsync } from "react-use";
import Head from "next/head";
import { useRouter } from "next/router";
import unzip from "lodash/unzip";
import { Async } from "../../components/Async";

export default function Surveys(/*props*/) {
  const router = useRouter();

  const question = useAsync(async () => {
    if (!router.query.id) return;
    const response = await fetch(`/api/questions?id=${router.query.id}`);
    const result = await response.json();
    return result.question;
  }, [router.query.id]);

  const results = useAsync(async () => {
    if (!router.query.id) return;
    const response = await fetch(
      `/api/responses?questionId=${router.query.id}`
    );
    const result = await response.json();
    return result.responses;
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>Results</title>
      </Head>
      <Async data={question}>
        <Async data={results}>
          <Result question={question.value} results={results.value}></Result>
        </Async>
      </Async>
    </>
  );
}

function Result(props) {
  if (!Array.isArray(props.results)) return <></>;
  if (!props.question) return <></>;

  const selections = props.results.map((r) => r.selections);
  const selectionCounts = unzip(selections).map(
    (a) => a.filter(Boolean).length
  );
  const data = selectionCounts.map((count, i) => ({
    count,
    index: i,
    percent: count / selections.length,
    response: props.question.optionTextsEnglish[i],
  }));

  return (
    <div>
      <h1>{props.question.promptTextEnglish}</h1>
      {data.map((option) => (
        <div key={option.index}>
          {option.response} {formatPercent(option.percent)}
        </div>
      ))}
    </div>
  );
}
function ShowJSON(props) {
  //   const data = props.children ?? undefined;
  return <pre>{JSON.stringify(props.children, null, 2)}</pre>;
}

function formatPercent(n) {
  return Math.floor(n * 100) + "%";
}
