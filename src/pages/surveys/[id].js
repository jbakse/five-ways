import React from "react";
import Link from "next/link";
import { useAsync } from "react-use";
import Head from "next/head";
import { useRouter } from "next/router";
import { Async } from "../../components/Async";
import { ShowData } from "../../components/ShowData";

export default function SurveyPage(/*props*/) {
  const router = useRouter();
  const survey = useAsync(async () => {
    if (!router.query.id) return;
    const response = await fetch(`/api/surveys?id=${router.query.id}`);
    const result = await response.json();
    return result.survey;
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>

      <div className="content-block">
        <Async data={survey}>
          <h1>Survey "{survey.value?.nickname}"</h1>

          <ol>
            {survey.value?.questions.map((q) => (
              <li key={q.id}>
                <Link href={`/questions/${encodeURIComponent(q.id)}`}>
                  {q.nickname || "unnamed"}
                </Link>
              </li>
            ))}
          </ol>

          <ShowData
            title={`${survey.value?.nickname}_export`}
            data={survey.value}
          ></ShowData>
        </Async>
      </div>
    </>
  );
}
