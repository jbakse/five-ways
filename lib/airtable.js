const Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

async function getSurvey(id) {
  const result = await base("Survey").find(id);
  return { id, ...result.fields };
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
  try {
    const survey = await getSurvey(surveyId);
    const questionIds = survey.questions;
    const questionPromises = questionIds.map(getQuestion);
    const questions = await Promise.all(questionPromises);
    return questions;
  } catch (e) {
    console.log("Error loading data.\n", e);
    return [];
  }
}

export async function sendResponse(
  responderId,
  surveyId,
  questionId,
  selections
) {
  const selectionIndexes = selections // map [true, false, true] to [0, 2]
    .map((e, i) => (e === true ? i : false)) // turn trues into index value
    .filter((e) => e !== false); // remove falses

  //todo: should overwrite if P={survey, question, responder} already exists
  await base("Response").create({
    responderId,
    Survey: [surveyId],
    Question: [questionId],
    responseIndexes: JSON.stringify(selectionIndexes),
  });
}
