const Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

async function getSurvey(id) {
  const result = await base("Survey").find(id);
  return {
    id,
    nickname: result.fields.nickname ?? "unnamed",
    questions: result.fields.questions ?? [],
  };
}

async function getQuestion(id) {
  const result = await base("Question").find(id);
  return {
    id,
    ...result.fields,
    optionTextsEnglish: result.fields.optionTextsEnglish.split("\n"),
  };
}

export async function getQuestions(surveyId) {
  console.log("getQuestions", surveyId);

  try {
    const survey = await getSurvey(surveyId);

    const questionIds = survey.questions;
    const questionPromises = questionIds.map(getQuestion);
    const questions = await Promise.all(questionPromises);
    return questions;
  } catch (e) {
    console.log("Error loading survey questions.\n", e);
    return [];
  }
}

export async function getSurveys() {
  try {
    const pages = await base("Survey").select({});
    const surveys = [];

    await new Promise((resolve, reject) => {
      pages.eachPage(
        async function page(records, fetchNextPage) {
          const promises = records.map(async (r) => {
            const qs = await getQuestions(r.id);
            surveys.push({
              id: r.id,
              nickname: r.fields.nickname,
              questions: qs,
            });
          });
          await Promise.allSettled(promises);
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
