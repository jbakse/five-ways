import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { useAsync } from "react-use";
import unzip from "lodash/unzip";
import { Async } from "../../components/Async";
import { formatPercent, allFalse } from "../../lib/util";
import { ShowJSON } from "../../components/ShowJSON";
import { PieChart } from "../../components/PieChart";

export default function ResultPage(/*props*/) {
  const router = useRouter();

  const question = useAsync(async () => {
    if (!router.query.id) return;
    const response = await fetch(`/api/questions?id=${router.query.id}`);
    const result = await response.json();
    return result.question;
  }, [router.query.id]);

  const responses = useAsync(async () => {
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
        <Async data={responses}>
          <Result
            question={question.value}
            responses={responses.value}
          ></Result>
        </Async>
      </Async>

      <Async data={responses}>
        <ShowJSON title="responses">{responses.value}</ShowJSON>
      </Async>
      <Async data={question}>
        <ShowJSON title="question">{question.value}</ShowJSON>
      </Async>
    </>
  );
}

function Result({ responses, question }) {
  // const [data, setData] = useState(false);

  const data = useMemo(
    function updateData() {
      if (!Array.isArray(responses)) return;
      if (!question) return;

      // gather selections
      const selections = responses.map((r) => r.selections);

      // count how many respondants choose option 1, option 2, etc.
      const selectionCounts = unzip(selections).map(
        (a) => a.filter(Boolean).length
      );

      // prepare data
      const data = selectionCounts.map((count, index) => ({
        count,
        index: index,
        percent: count / selections.length,
        response: question.optionTextsEnglish[index],
      }));

      // add noSelection / none of the above
      const noSelectionCount = selections.filter(allFalse).length;
      data.push({
        index: data.length,
        count: noSelectionCount,
        percent: noSelectionCount / selections.length,
        response: "No Selections",
      });

      return data;
    },
    [responses, question]
  );

  if (!data) return <></>;
  return (
    <>
      <h1 className="content-block">{question.promptTextEnglish}</h1>
      {data.map((option) => (
        <div key={option.index} className="content-block">
          {option.response} {formatPercent(option.percent)}
        </div>
      ))}
      <PieChart data={data.map((d) => d.count)} />
      <ShowJSON title="data">{data}</ShowJSON>
    </>
  );
}
