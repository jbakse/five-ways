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

async function getQuestionData(id) {
  const result = await base("Question").find(id);
  return {
    id,
    ...result.fields,
    optionTextsEnglish: result.fields.optionTextsEnglish.split("\n"),
  };
}

async function getQuestions(questionIds) {
  try {
    const questionPromises = questionIds.map(getQuestionData);
    const questions = await Promise.all(questionPromises);
    return questions;
  } catch (e) {
    console.log("Error loading survey questions.\n", e);
    return [];
  }
}

export async function getSurvey(surveyId) {
  const surveyData = await getSurveyData(surveyId);
  console.log("surveyData", surveyData);
  const questions = await getQuestions(surveyData.questionIds);
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
          // const promises = records.map(async (r) => {
          //   const qs = await getQuestions(r.fields.questions ?? []);
          //   surveys.push({
          //     id: r.id,
          //     nickname: r.fields.nickname,
          //     questions: qs,
          //   });
          // });
          // await Promise.allSettled(promises);
          records.forEach((r) => {
            surveys.push({
              id: r.id,
              nickname: r.fields.nickname,
              questionCount: r.fields.questions?.length ?? 0,
            });
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            reject();
          }
          resolve();
        }
      );
    });
    return surveys;
  } catch (e) {
    console.log("Error loading surveys.\n", e);
    return [];
  }
}
