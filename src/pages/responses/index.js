import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAsync } from "react-use";
import { formatDateShort, formatShort, buildQuery } from "../../lib/util";
import { Async } from "../../components/Async";
import { Table } from "../../components/Table";
import { ShowJSON } from "../../components/ShowJSON";
import styles from "../../styles/admin.module.scss";

export async function getServerSideProps(context) {
  return { props: { query: context.query } };
}

export default function ResponsesIndex({ query }) {
  const today = new Date().toLocaleDateString("en-CA");

  const [startDate, setStartDate] = useState(query.startDate || today);
  const [endDate, setEndDate] = useState(query.endDate || today);
  const [language, setLanguage] = useState(query.language);
  const [responderId, setResponderId] = useState(query.responderId);
  const [surveyId, setSurveyId] = useState(query.surveyId);
  const [questionId, setQuestionId] = useState(query.questionId);
  const [onlyAnswered, setOnlyAnswered] = useState(query.onlyAnswered || true);

  // update url when params change
  const router = useRouter();
  useEffect(
    () => {
      const url = new URL(window.location);
      const query = buildQuery({
        startDate,
        endDate,
        language,
        responderId,
        surveyId,
        questionId,
        onlyAnswered,
      });
      url.search = query;

      router.replace(url.toString(), undefined, { shallow: true });
    },
    // ignore the router as a dependency, otherwise we get an infinite loop
    // https://stackoverflow.com/questions/69203538/useeffect-dependencies-when-using-nextjs-router
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      startDate,
      endDate,
      language,
      responderId,
      surveyId,
      questionId,
      onlyAnswered,
    ]
  );

  // fetch the matching responses
  const responses = useAsync(async () => {
    const response = await fetch(
      `/api/responses?${buildQuery({
        startDate,
        endDate,
        language,
        responderId,
        surveyId,
        questionId,
        onlyAnswered,
      })}`
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const result = await response.json();

    return result.responses;
  }, [
    startDate,
    endDate,
    language,
    responderId,
    surveyId,
    questionId,
    onlyAnswered,
  ]);

  // configure the table

  function formatResponse(response) {
    if (response === false) return "";
    if (typeof response === "string") return response;

    // loop over array getting key and value
    // return JSON.stringify(boolArray);
    return response
      .map((value, index) => {
        if (value) {
          return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index];
        } else {
          return false;
        }
      })
      .filter(Boolean)
      .join("");
  }

  const columns = [
    { header: "responseId", field: "id" },
    { header: "createdAt", field: "createdAt", formatter: formatDateShort },
    {
      header: "responderId",
      field: "responderId",
      formatter: formatShort,
      onClick: (row) => {
        setResponderId(row.responderId);
      },
    },
    {
      header: "surveyId",
      field: "surveyId",
      formatter: formatShort,
      onClick: (row) => {
        setSurveyId(row.surveyId);
      },
    },
    {
      header: "questionId",
      field: "questionId",
      formatter: formatShort,
      onClick: (row) => {
        setQuestionId(row.questionId);
      },
    },
    {
      header: "language",
      field: "language",
      onClick: (row) => {
        setLanguage(row.language);
      },
    },
    { header: "response", field: "response", formatter: formatResponse }, //JSON.stringify
  ];

  // render the page
  return (
    <>
      <Head>
        <title>Responses</title>
      </Head>
      <div className="content-block">
        <h1>Responses</h1>

        <div>
          <div className={styles.inputGroup}>
            <label htmlFor="from">From:</label>
            <input
              name="from"
              type="date"
              className="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            ></input>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="to">To:</label>
            <input
              name="to"
              type="date"
              className="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            ></input>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="language">Language:</label>
            <input
              name="language"
              type="search"
              className="search"
              placeholder=" "
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            ></input>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="responder">Responder:</label>
            <input
              name="responder"
              type="search"
              className="search"
              placeholder=" "
              value={responderId}
              onChange={(e) => setResponderId(e.target.value)}
            ></input>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="survey">Survey:</label>
            <input
              name="survey"
              type="search"
              className="search"
              placeholder=" "
              value={surveyId}
              onChange={(e) => setSurveyId(e.target.value)}
            ></input>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="question">Question:</label>
            <input
              name="question"
              type="search"
              className="search"
              placeholder=" "
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
            ></input>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="checkbox"
              checked={onlyAnswered}
              onChange={() => setOnlyAnswered(!onlyAnswered)}
            />
            <label htmlFor="onlyAnswered">Only Answered</label>
          </div>
        </div>
        <br />
        <Async data={responses}>
          <h2>
            {responses.value?.length} matching response
            {responses.value?.length === 1 ? "" : "s"}
          </h2>
          <Table columns={columns} data={responses.value} />
          <ShowJSON title="responses" data={responses.value}></ShowJSON>
        </Async>
      </div>
    </>
  );
}
