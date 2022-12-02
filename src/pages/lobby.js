import React, { useState } from "react";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { getSurveyDeep } from "../lib/airtable";
import Question from "../components/Question";
import SlideShow from "../components/SlideShow";
import splash from "../components/Splash.module.scss";
import LanguageSelect from "../components/LanguageSelect";

export async function getServerSideProps(/*context*/) {
  const surveyId = "recVZKGGAb7BaWPvf"; //TODO: make configurable
  return {
    props: {
      survey: await getSurveyDeep(surveyId),
    },
  };
}

export default function LobbyPage() {
  //   const [language, setLanguage] = useState("English");

  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <SlideShow>
        <div>1</div>
        <div>2</div>
      </SlideShow>
    </>
  );
}
