const Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

async function getSurvey() {
  const survey = (await base("Survey").select().firstPage())[0];
  return {
    questions: survey.get("Questions"),
  };
}

async function getQuestion(id) {
  const question = await base("Question").find(id);

  return {
    id: question.id,
    prompt: question.get("Prompt"),
    type: question.get("Type"),
    options: question.get("Options").split("\n"),
  };
}

export async function getQuestions() {
  const survey = await getSurvey();
  const questionIds = survey.questions;
  const questionPromises = questionIds.map(getQuestion);
  const questions = await Promise.all(questionPromises);
  return questions;
}
