import React, { useState } from "react";
import classNames from "classnames";

// todo: doesn't match
import styles from "./Question.module.scss";

export default function LanguageSelect(props) {
  const languages = ["English", "Spanish", "Hmong", "Somali"];
  const [selections, setSelections] = useState(
    Array.from({ length: languages.length }).fill(false)
  );

  function optionClicked(optionIndex) {
    props.setLanguage(languages[optionIndex]);
    const newSelections = Array.from({
      length: languages.length,
    }).fill(false);
    newSelections[optionIndex] = true;
    setSelections(newSelections);
  }

  return (
    <div className={styles.question}>
      <h2 className={styles.number}>&nbsp;</h2>
      <h2 className={styles.prompt}>
        I would like to help rethink how the Walker makes exhibitions!
      </h2>
      <span className={styles.instruction}>Select one</span>

      <ul className={styles.options} role="list">
        {languages.map((optionText, index) => (
          <li
            className={classNames(
              styles.option,
              selections[index] && styles.selected
            )}
            key={index}
            onClick={(error) => optionClicked(index, error)}
          >
            <div className={styles.optionBorder}></div>
            <div className={styles.optionText}>{optionText}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
