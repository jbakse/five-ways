// eslint-disable-next-line unicorn/prefer-module
const Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

async function getSurveyData(id) {
  const result = await base("Survey").find(id);
  return {
    id,
    nickname: result.fields.nickname ?? "unnamed",
    questionIds: result.fields.questions ?? [],
  };
}

export async function getQuestionData(id) {
  const result = await base("Question").find(id);

  let images = [];
  const alts = result.fields.imagesAlts?.split("\n") || [];
  if (result.fields.images?.length) {
    images = result.fields.images.map((image, index) => ({
      src: image.url,
      alt: alts[index] || "",
      width: image.width,
      height: image.height,
    }));
  }

  // TODO: come back here and carefully normalize input

  return {
    id,
    ...result.fields,
    images,
    optionTextsEnglish: result.fields.optionTextsEnglish.split("\n"),
    optionTextsSpanish: result.fields.optionTextsSpanish.split("\n"),
    optionTextsHmong: result.fields.optionTextsHmong.split("\n"),
    optionTextsSomali: result.fields.optionTextsSomali.split("\n"),
  };
}

async function getQuestionDatas(questionIds) {
  try {
    const questionPromises = questionIds.map(getQuestionData);
    const questions = await Promise.all(questionPromises);
    return questions;
  } catch (error) {
    console.warn("Error loading survey questions.\n", error);
    return [];
  }
}

export async function getSurveyDeep(surveyId) {
  const surveyData = await getSurveyData(surveyId);

  const questions = await getQuestionDatas(surveyData.questionIds);
  return {
    id: surveyData.id,
    nickname: surveyData.nickname,
    questions,
  };
}

export async function getSurveys() {
  try {
    const pages = await base("Survey").select({});
    const surveys = [];

    await new Promise((resolve, reject) => {
      pages.eachPage(
        function page(records, fetchNextPage) {
          for (const r of records) {
            surveys.push({
              id: r.id,
              nickname: r.fields.nickname,
              questionCount: r.fields.questions?.length ?? 0,
            });
          }
          fetchNextPage();
        },
        function done(error) {
          if (error) {
            console.error(error);
            reject();
          }
          resolve();
        }
      );
    });
    return surveys;
  } catch (error) {
    console.log("Error loading surveys.\n", error);
    return [];
  }
}
