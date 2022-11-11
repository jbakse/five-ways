import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useAsync } from "react-use";
import unzip from "lodash/unzip";
import { Async } from "../../components/Async";
import { formatPercent } from "../../lib/util";
import { ShowJSON } from "../../components/ShowJSON";
import { PieChart } from "../../components/PieChart";
import styles from "../../components/Result.module.scss";

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

      const totalCount = responses.length;
      const answeredCount = selectionCounts.reduce((a, b) => a + b, 0);

      // prepare data
      const options = selectionCounts.map((count, index) => ({
        count,
        index: index,
        percentOfAnswered: count / answeredCount,
        precentOfTotal: count / totalCount,
        response: question.optionTextsEnglish[index],
      }));

      options.sort((a, b) => b.count - a.count);

      for (const [index, option] of options.entries()) {
        option.label = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index];
      }

      // // add noSelection / none of the above
      // const noSelectionCount = selections.filter(allFalse).length;
      // data.push({
      //   index: data.length,
      //   count: noSelectionCount,
      //   percent: 0,
      //   percentTotal: noSelectionCount / selections.length,
      //   response: "No Selections",
      // });

      const data = {
        totalCount,
        answeredCount,
        options,
      };
      return data;
    },
    [responses, question]
  );

  if (!data) return <></>;
  return (
    <>
      <div className={styles.Result}>
        <div className={styles.QuestionWrap}>
          <h1>{question.promptTextEnglish}</h1>
          {data.options.map((option) => (
            <div key={option.index} className={styles.Option}>
              {option.label}:&nbsp;
              {option.response}&nbsp;
              {/* {formatPercent(option.percentOfAnswered)}&nbsp; */}
              {/* {formatPercent(option.precentOfTotal)} */}
            </div>
          ))}
        </div>
        <div className={styles.ChartWrap}>
          <PieChart data={data.options.map((d) => d.count)} />
        </div>
      </div>

      <ShowJSON title="data">{data}</ShowJSON>
    </>
  );
}
