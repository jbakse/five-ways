import React from "react";
import Head from "next/head";
import { getSurveyDeep } from "../lib/airtable";
import SlideShow from "../components/SlideShow";

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
