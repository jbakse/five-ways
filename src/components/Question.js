import React, { useState } from "react";
import classNames from "classnames";
import { useAsyncDeep } from "../lib/hooks";
import { postData } from "../lib/util";
import styles from "./Question.module.scss";

// <Question>
// responderId - uuid of the survey taker, generated when survey is displayed
// surveyId - unique id of the survey being taken
// id - questionId
// type - single | multiple
// promptTextEnglish - question text in english
// optionTextsEnglish - array of answers in english

export default function Question(props) {
  const [selections, setSelections] = useState(
    new Array(props.optionTextsEnglish.length).fill(false)
  );

  // post data to backend when data changes (use deep compare)
  useAsyncDeep(postData, [
    "/api/responses",
    {
      responderId: props.responderId,
      surveyId: props.surveyId,
      questionId: props.id,
      selections: selections,
    },
  ]);

  function optionClicked(optionIndex) {
    if (props.type === "single") {
      // single select
      const newSelections = Array(props.optionTextsEnglish.length).fill(false);
      newSelections[optionIndex] = true;
      setSelections(newSelections);
    } else if (props.type === "multiple") {
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
