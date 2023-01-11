import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { getSurveyDeep, getConfiguration } from "../lib/airtable";
import Question from "../components/Question";
import SlideShow from "../components/SlideShow";
import splash from "../components/Splash.module.scss";
import LanguageSelect from "../components/LanguageSelect";
import { useTimeout } from "../lib/hooks";

export async function getServerSideProps({ res, query }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=600"
  );

  const isGallery = "gallery" in query;
  const config = await getConfiguration();
  const surveyId = isGallery ? config.gallerySurveyId : config.homeSurveyId;
  const survey = surveyId ? await getSurveyDeep(surveyId) : null;
  // remove slides, they are shown only in the lobby report
  survey.questions = survey.questions.filter((q) => q.type !== "slide");
  // open questions are not supported yet
  survey.questions = survey.questions.filter((q) => q.type !== "open");

  return {
    props: {
      config,
      survey,
    },
  };
}

export default function TakeSurveyPage(props) {
  const [responderId] = useState(uuidv4());

  const [language, setLanguage] = useState("English");

  const router = useRouter();
  useTimeout("gallery" in router.query ? props.config.galleryTimeout : false);

  if (!props.survey)
    return (
      <>
        <Head>Survey Closed</Head>
        <NoSurvey />
      </>
    );

  return (
    <>
      <Head>
        <title>Survey</title>
        <link
          rel="preload"
          href="/fonts/MaxevilleTrial-Construct.otf"
          as="font"
          crossOrigin="anonymous"
        />
      </Head>

      <SlideShow>
        <Splash key="splash" />
        <LanguageSelect key="lang" setLanguage={setLanguage} />

        {props.survey.questions.map((q, index) => (
          <Question
            responderId={responderId}
            surveyId={props.survey.id}
            {...q}
            questionNumber={index + 1}
            key={q.id}
            language={language}
          />
        ))}

        <ThankYou key="thankyou" />
      </SlideShow>
    </>
  );
}

function Splash() {
  return (
    <div className={splash.Splash}>
      <h1>
        Make
        <br /> Sense
        <br /> of
        <br /> (This)
      </h1>
    </div>
  );
}

function NoSurvey() {
  return (
    <div className={splash.Splash}>
      <p>Sorry!</p>
      <p>The survey is currently closed.</p>
    </div>
  );
}

function ThankYou() {
  return (
    <div className={splash.Splash}>
      <p>Thank you!</p>
      <p>
        Your responses will help shape future exhibitions at the Walker. Take a
        look at the monitor in the gallery to see how your answers compare with
        others.
      </p>
    </div>
  );
}
