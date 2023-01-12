import Image from "next/image";
import React, { useState } from "react";
import classNames from "classnames";
import { useAsyncDeep } from "../lib/hooks";
import { postData } from "../lib/network";
import styles from "./Question.module.scss";

export default function Question(props) {
  const prompt = props[`promptText${props.language}`];
  const optionTexts = props[`optionTexts${props.language}`];

  const [response, setResponse] = useState(false);

  // post data to backend when data changes (use deep compare)
  useAsyncDeep(postData, [
    "/api/responses",
    {
      responderId: props.responderId,
      surveyId: props.surveyId,
      questionId: props.id,
      response: response,
      language: props.language,
    },
  ]);

  function optionClicked(optionIndex) {
    if (props.type === "single") {
      // single select
      const newResponse = Array.from({
        length: optionTexts.length,
      }).fill(false);
      newResponse[optionIndex] = true;
      setResponse(newResponse);
    } else if (props.type === "multiple") {
      // multiple select
      const allFalse = Array.from({ length: optionTexts.length }).fill(false);
      const newResponse = [...(response || allFalse)];
      newResponse[optionIndex] = !newResponse[optionIndex];
      setResponse(newResponse);
    }
  }

  return (
    <div className={styles.question}>
      <h2 className={styles.number}>
        {props.questionNumber.toString().padStart(2, "0")}
      </h2>
      <h2 className={styles.prompt}>{prompt}</h2>
      <span className={styles.instruction}>
        {props.type === "single" ? "Select one" : "Select many"}
      </span>
      <ul className={styles.options} role="list">
        {optionTexts.map((optionText, index) => (
          <li
            className={classNames(
              styles.option,
              response[index] && styles.selected,
              "image-block-hack"
            )}
            key={index}
            onClick={(error) => optionClicked(index, error)}
          >
            <div className={styles.optionBorder}></div>
            {props.images[index] && (
              <Image
                priority
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
