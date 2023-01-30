import Image from "next/image";
import React, { useState } from "react";
import classNames from "classnames";
import { useDebounce } from "react-use";
import { useAsyncDeep } from "../lib/hooks";
import { postData } from "../lib/network";
import styles from "./Question.module.scss";

// review: destructure props?
// generally i'm destructuring props in the function signature
// there are many props here so i'll come back to this later if needed

export default function Question(props) {
  const prompt = props[`promptText${props.language}`];
  const optionTexts = props[`optionTexts${props.language}`];

  const [response, setResponse] = useState(false);
  const [responseD, setResponseD] = useState(false);

  // copy resonse to responseD but debounced to limit api traffic

  useDebounce(
    () => {
      setResponseD(response);
    },
    500,
    [response]
  );

  // post data to backend when data changes (use deep compare)
  useAsyncDeep(postData, [
    "/api/responses",
    {
      responderId: props.responderId,
      surveyId: props.surveyId,
      questionId: props.id,
      response: responseD,
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
    <div className={styles.Question}>
      <h2 className={styles.Number}>
        {props.questionNumber.toString().padStart(2, "0")}
      </h2>
      <h2 className={styles.Prompt}>{prompt}</h2>
      <span className={styles.Instruction}>
        {props.type === "single" && "Select one"}
        {props.type === "multiple" && "Select many"}
        {props.type === "open" && "Type your response"}
      </span>
      {options()}
      {openField()}
    </div>
  );

  function openField() {
    if (props.type === "open") {
      return (
        <textarea
          key="openfield"
          className={styles.OpenField}
          placeholder="Begin typing here"
          value={response || ""}
          onChange={(e) => setResponse(e.target.value)}
        ></textarea>
      );
    }
  }
  function options() {
    if (props.type === "single" || props.type === "multiple") {
      return (
        <ul className={styles.Options} role="list">
          {optionTexts.map((optionText, index) => (
            <li
              className={classNames(
                styles.Option,
                response[index] && styles.selected,
                "image-block-hack"
              )}
              key={index}
              onClick={(error) => optionClicked(index, error)}
            >
              <div className={styles.OptionBorder}></div>
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
                <div className={styles.OptionText}>{optionText}</div>
              )}
            </li>
          ))}
        </ul>
      );
    }
  }
}
