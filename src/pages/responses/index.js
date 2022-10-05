import React, { useState } from "react";
import { useAsync } from "react-use";
import Head from "next/head";
import { formatDate } from "../../lib/util";
import { Async } from "../../components/Async";
import { Table } from "../../components/Table";
import { ShowJSON } from "../../components/ShowJSON";

export default function ResponsesPage(/*props*/) {
  const today = new Date().toLocaleDateString("en-CA");

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const responses = useAsync(async () => {
    const response = await fetch(
      `/api/responses?start=${startDate}&end=${endDate}`
    );
    const result = await response.json();
    return result.responses;
  }, [startDate, endDate]);

  function shorten(s) {
    //recVZKGGAb7BaWPvf -> re..vf
    return s.substr(0, 2) + ".." + s.substr(-2);
  }

  const columns = [
    { header: "responseId", field: "id" },
    { header: "createdAt", field: "createdAt", formatter: formatDate },
    { header: "responderId", field: "responderId", formatter: shorten },
    { header: "surveyId", field: "surveyId", formatter: shorten },
    { header: "questionId", field: "questionId", formatter: shorten },
    { header: "response", field: "selections", formatter: JSON.stringify },
  ];

  return (
    <>
      <Head>
        <title>Responses</title>
      </Head>
      <h1 className="content-block">Responses</h1>
      <div className="content-block">
        From:&nbsp;
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        ></input>
        &nbsp;&nbsp; To:&nbsp;
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        ></input>
      </div>

      <Async data={responses}>
        <Table columns={columns} data={responses.value} />
        <ShowJSON title="responses">{responses.value}</ShowJSON>
      </Async>

      {/* {responses.loading ? (
        <div>Loading...</div>
      ) : responses.error ? (
        <div>Error: {responses.error.message}</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>responseId</th>
              <th>createdAt</th>
              <th>responderId</th>
              <th>surveyId</th>
              <th>questionId</th>
              <th>response</th>
            </tr>
          </thead>
          <tbody>
            {responses.value.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{formatDate(p.createdAt)}</td>
                <td>{shorten(p.responderId)}</td>
                <td>{shorten(p.surveyId)}</td>
                <td>{shorten(p.questionId)}</td>
                <td>{JSON.stringify(p.selections)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )} */}
    </>
  );
}
