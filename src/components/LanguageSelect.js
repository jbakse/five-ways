import React, { useState } from "react";
import classNames from "classnames";
import styles from "./Question.module.scss";

export default function LanguageSelect({ setLanguage }) {
  const languages = ["English", "Spanish", "Hmong", "Somali"];
  const [selections, setSelections] = useState(
    Array.from({ length: languages.length }).fill(false)
  );

  function optionClicked(optionIndex) {
    setLanguage(languages[optionIndex]);
    const newSelections = Array.from({
      length: languages.length,
    }).fill(false);
    newSelections[optionIndex] = true;
    setSelections(newSelections);
  }

  return (
    <div className={styles.Question}>
      <h2 className={styles.Number}>&nbsp;</h2>
      <h2 className={styles.Prompt}>
        I would like to help rethink how the Walker makes exhibitions!
      </h2>
      <span className={styles.Instruction}>Select one</span>

      <ul className={styles.Options} role="list">
        {languages.map((optionText, index) => (
          <li
            className={classNames(
              styles.Option,
              selections[index] && styles.selected
            )}
            key={index}
            onClick={(error) => optionClicked(index, error)}
          >
            <div className={styles.OptionBorder}></div>
            <div className={styles.OptionText}>{optionText}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
