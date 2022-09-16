// libs
import { useState } from "react";
import classNames from "classnames";

// components
import Head from "next/head";

// js
import { getQuestions } from "../lib/airtable";

// css
import styles from "../styles/survey.module.scss";

export async function getServerSideProps(context) {
  return {
    props: {
      questions: await getQuestions(),
    },
  };
}

export default function Survey({ questions }) {
  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <div className={styles.survey}>
        {questions.map((q, i) => (
          <Question question={q} key={q.id} />
        ))}
      </div>
    </>
  );
}

function Question(props) {
  const options = props.question.options;

  const [selections, setSelections] = useState(
    new Array(options.length).fill(false)
  );

  function optionClicked(optionIndex, e) {
    if (props.question.type === "single") {
      // single select
      const newSelections = Array(options.length).fill(false);
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
      <h2 className={styles.prompt}>{props.question.prompt}</h2>
      <span className={styles.instruction}>
        {props.question.type === "single" ? "choose one" : "choose many"}
      </span>
      <ul className={styles.options} role="list">
        {options.map((option, i) => {
          return (
            <li
              className={classNames(
                styles.option,
                selections[i] && styles.selected
              )}
              key={i}
              onClick={(e) => optionClicked(i, e)}
            >
              <span className={styles.checkbox}></span>
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
