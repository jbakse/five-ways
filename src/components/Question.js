import Image from "next/image";
import React, { useState } from "react";
import classNames from "classnames";
import { useAsyncDeep } from "../lib/hooks";
import { postData } from "../lib/network";
import styles from "./Question.module.scss";

export default function Question(props) {
  const prompt = props[`promptText${props.language}`];
  const optionTexts = props[`optionTexts${props.language}`];

  const [selections, setSelections] = useState(
    Array.from({ length: optionTexts.length }).fill(false)
  );

  // post data to backend when data changes (use deep compare)
  useAsyncDeep(postData, [
    "/api/responses",
    {
      responderId: props.responderId,
      surveyId: props.surveyId,
      questionId: props.id,
      selections: selections,
      language: props.language,
    },
  ]);

  function optionClicked(optionIndex) {
    if (props.type === "single") {
      // single select
      const newSelections = Array.from({
        length: optionTexts.length,
      }).fill(false);
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
      <h2 className={styles.number}>{props.questionNumber}</h2>
      <h2 className={styles.prompt}>{prompt}</h2>
      <span className={styles.instruction}>
        {props.type === "single" ? "Select one" : "Select many"}
      </span>
      <ul className={styles.options} role="list">
        {optionTexts.map((optionText, index) => (
          <li
            className={classNames(
              styles.option,
              selections[index] && styles.selected,
              "image-block-hack"
            )}
            key={index}
            onClick={(error) => optionClicked(index, error)}
          >
            <div className={styles.optionBorder}></div>
            {props.images[index] && (
              <Image
                src={props.images[index].src}
                alt={props.images[index].alt}
                width={props.images[index].width}
                height={props.images[index].height}
              />
            )}
            {optionText && (
              <div className={styles.optionText}>{optionText}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
