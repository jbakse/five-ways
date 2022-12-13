import React, { useState } from "react";
import { useAsync } from "react-use";
import Head from "next/head";
import { formatDateShort, formatShort, buildQuery } from "../../lib/util";
import { Async } from "../../components/Async";
import { Table } from "../../components/Table";
import { ShowJSON } from "../../components/ShowJSON";

export default function ResponsesIndex(/*props*/) {
  const today = new Date().toLocaleDateString("en-CA");

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [language, setLanguage] = useState();
  const [responderId, setResponderId] = useState();
  const [surveyId, setSurveyId] = useState();
  const [questionId, setQuestionId] = useState();

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
      })}`
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const result = await response.json();

    return result.responses;
  }, [startDate, endDate, language, responderId, surveyId, questionId]);

  // configure the table

  function formatResponse(boolArray) {
    // loop over array getting key and value
    // return JSON.stringify(boolArray);
    return boolArray
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
    { header: "response", field: "selections", formatter: formatResponse }, //JSON.stringify
  ];

  // render the page
  return (
    <>
      <Head>
        <title>Responses</title>
      </Head>
      <h1 className="content-block">Responses</h1>

      <div className="content-block">
        <div className="input-group">
          <label htmlFor="from">From:</label>
          <input
            name="from"
            type="date"
            className="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          ></input>
        </div>

        <div className="input-group">
          <label htmlFor="to">To:</label>
          <input
            name="to"
            type="date"
            className="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          ></input>
        </div>

        <div className="input-group">
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

        <div className="input-group">
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

        <div className="input-group">
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

        <div className="input-group">
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
      </div>
      <Async className="content-block" data={responses}>
        <Table columns={columns} data={responses.value} />
        <ShowJSON title="responses">{responses.value}</ShowJSON>
      </Async>
    </>
  );
}
