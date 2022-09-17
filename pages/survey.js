import React, { useState } from "react";
import classNames from "classnames";
import Head from "next/head";
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
  console.log("s", props);
  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <div className={styles.survey}>
        {props.questions.map((q) => (
          <Question {...q} surveyId={props.id} key={q.id} />
        ))}
      </div>
    </>
  );
}

function Question(props) {
  // { id, type, promptTextEnglish, optionTextsEnglish }

  const [selections, setSelections] = useState(
    new Array(props.optionTextsEnglish.length).fill(false)
  );

  function sendResponse(data) {
    fetch("/api/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  function optionClicked(optionIndex, e) {
    if (props.type === "single") {
      // single select
      const newSelections = Array(props.optionTextsEnglish.length).fill(false);
      newSelections[optionIndex] = true;
      setSelections(newSelections);
      const responderId = "test";
      console.log("surveyId", props.surveyId);
      sendResponse({
        responderId,
        surveyId: props.surveyId,
        questionId: props.id,
        selections,
      });
    } else {
      // multiple select
      const newSelections = [...selections];
      newSelections[optionIndex] = !newSelections[optionIndex];
      setSelections(newSelections);
    }
  }

  return (
    <div className={styles.question}>
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
    </div>
  );
}
