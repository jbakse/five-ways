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
    questionIds: result.fields.Questions ?? [],
  };
}

function lengthenArray(array, newLength, value) {
  array.splice(
    array.length,
    0,
    ...Array.from({ length: newLength - array.length }).fill(value)
  );
}

export async function getQuestionData(id) {
  // const result = await base("Question").find(id);
  const { fields } = await base("Question").find(id);

  // note: not lengthed yet
  const alts = fields.imagesAlts?.split("\n") || [];

  const optionTextsEnglish = fields.optionTextsEnglish?.split("\n") || [];
  const optionTextsSpanish = fields.optionTextsSpanish?.split("\n") || [];
  const optionTextsHmong = fields.optionTextsHmong?.split("\n") || [];
  const optionTextsSomali = fields.optionTextsSomali?.split("\n") || [];

  const optionCount = Math.max(
    alts.length,
    optionTextsEnglish.length,
    optionTextsSpanish.length,
    optionTextsHmong.length,
    optionTextsSomali.length
  );

  lengthenArray(optionTextsEnglish, optionCount, "");
  lengthenArray(optionTextsSpanish, optionCount, "");
  lengthenArray(optionTextsHmong, optionCount, "");
  lengthenArray(optionTextsSomali, optionCount, "");

  // note: not lengthed yet
  const images =
    fields.images?.map((image, index) => ({
      src: image.url,
      alt: alts[index] || "",
      width: image.width,
      height: image.height,
    })) || [];

  // TODO: come back here and carefully normalize input

  return {
    id,
    ...fields,
    optionTextsEnglish,
    optionTextsSpanish,
    optionTextsHmong,
    optionTextsSomali,
    images,
  };
}

export async function listQuestions() {
  try {
    const pages = await base("Question").select({
      fields: ["nickname", "type", "promptTextEnglish", "Surveys", "updated"],
      sort: [{ field: "updated", direction: "desc" }],
    });
    const questions = [];

    await new Promise((resolve, reject) => {
      pages.eachPage(
        function page(records, fetchNextPage) {
          for (const r of records) {
            questions.push({
              id: r.id,
              nickname: r.fields.nickname,
              type: r.fields.type,
              prompt: r.fields.promptTextEnglish,
              Surveys: r.fields.Surveys,
              updated: r.fields.updated,
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
    return questions;
  } catch (error) {
    console.log("Error loading surveys.\n", error);
    return [];
  }
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
    const pages = await base("Survey").select({
      sort: [{ field: "updated", direction: "desc" }],
    });
    const surveys = [];

    await new Promise((resolve, reject) => {
      pages.eachPage(
        function page(records, fetchNextPage) {
          for (const r of records) {
            surveys.push({
              id: r.id,
              nickname: r.fields.nickname,
              updated: r.fields.updated,
              questionCount: r.fields.Questions?.length ?? 0,
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
