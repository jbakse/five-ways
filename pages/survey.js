import React, { useState, useEffect, useId } from "react";
import classNames from "classnames";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { useDeepCompareEffect } from "react-use";
import { getQuestions } from "../lib/airtable";
import styles from "../styles/survey.module.scss";

export async function getServerSideProps(context) {
  return {
    props: {
      id: "recVZKGGAb7BaWPvf",
      questions: await getQuestions("recVZKGGAb7BaWPvf"),
    },
  };
}

export default function Survey(props) {
  const [responderId] = useState(uuidv4());

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <div className={styles.survey}>
        {props.questions.map((q) => (
          <Question
            responderId={responderId}
            surveyId={props.id}
            {...q}
            key={q.id}
          />
        ))}
      </div>
    </>
  );
}

async function postData(endPoint, data) {
  const response = await fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

// useAsyncDeep adapted from https://polvara.me/posts/fetching-asynchronous-data-with-react-hooks
function useAsyncDeep(getMethod, params) {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  async function getResource() {
    try {
      setLoading(true);
      const result = await getMethod(...params);
      setValue(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useDeepCompareEffect(() => {
    getResource();
  }, params);

  return { value, error, loading };
}

function Question(props) {
  // props = { id, type, promptTextEnglish, optionTextsEnglish }

  const [selections, setSelections] = useState(
    new Array(props.optionTextsEnglish.length).fill(false)
  );

  const response = useAsyncDeep(postData, [
    "/api/prismaResponse",
    {
      responderId: props.responderId,
      surveyId: props.surveyId,
      questionId: props.id,
      selections: selections,
    },
  ]);

  function optionClicked(optionIndex, e) {
    if (props.type === "single") {
      // single select
      const newSelections = Array(props.optionTextsEnglish.length).fill(false);
      newSelections[optionIndex] = true;
      setSelections(newSelections);
    } else {
      // multiple select
      const newSelections = [...selections];
      newSelections[optionIndex] = !newSelections[optionIndex];
      setSelections(newSelections);
    }
  }

  return (
    <div className={styles.question}>
      <div>{`respinder id: hidden, sid: ${props.surveyId}, qid: ${props.id}`}</div>
      <h2 className={styles.prompt}>{props.promptTextEnglish}</h2>
      <span className={styles.instruction}>
        {props.type === "single" ? "choose one" : "choose many"}
      </span>
      <ul className={styles.options} role="list">
        {props.optionTextsEnglish.map((optionText, i) => (
          <li
            className={classNames(
              styles.option,
              selections[i] && styles.selected
            )}
            key={i}
            onClick={(e) => optionClicked(i, e)}
          >
            <span className={styles.checkbox}></span>
            {optionText}
          </li>
        ))}
      </ul>
      {/* {responseId.loading ? (
        <span>loading</span>
      ) : responseId.error ? (
        <span>error: {responseId.error.message}</span>
      ) : (
        <span>value: {"" + responseId.value.id}</span>
      )} */}
    </div>
  );
}
