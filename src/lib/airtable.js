// eslint-disable-next-line unicorn/prefer-module
const Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

/**

# Airtable Question Schema

string      | nickname               | human readable nickname (not unique!)
<<Question  | Questions              | ordered questions in this survey
date        | updated                | last modified date

*/

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

/**

# Airtable Question Schema

string     | nickname                | human readable nickname (not unique!)
<<Survey   | Surveys                 | survey this question belongs too

enum       | type                    | single, multiple, open

string     | promptTextEnglish       |
string     | optionTextsEnglish      | newline delimited
string     | promptTextSpanish       |
string     | optionTextsSpanish      | newline delimited
string     | promptTextHmong         |
string     | optionTextsHmong        | newline delimited
string     | promtTextSomali         |
string     | optionTextsSomali       | newline delimited

attach[]   | images                  | image attachments
string     | imagesAlts              | newline delimited

date       | updated                 | last modified date


*/

export async function getQuestionData(id) {
  const { fields } = await base("Question").find(id);

  // todo: handle error
  // actually maybe not? just let the exception bubble up?

  // normalize data
  const type = fields.type || "single";
  const promptTextEnglish = fields.promptTextEnglish || "";
  const promptTextSpanish = fields.promptTextSpanish || "";
  const promptTextHmong = fields.promptTextHmong || "";
  const promtTextSomali = fields.promtTextSomali || "";
  const optionTextsEnglish = fields.optionTextsEnglish?.split("\n") || [];
  const optionTextsSpanish = fields.optionTextsSpanish?.split("\n") || [];
  const optionTextsHmong = fields.optionTextsHmong?.split("\n") || [];
  const optionTextsSomali = fields.optionTextsSomali?.split("\n") || [];
  const imageAlts = fields.imagesAlts?.split("\n") || [];

  // pad arrays with empty strings to make them all the same length
  const optionCount = Math.max(
    optionTextsEnglish.length,
    optionTextsSpanish.length,
    optionTextsHmong.length,
    optionTextsSomali.length,
    imageAlts.length
  );
  lengthenArray(optionTextsEnglish, optionCount, "");
  lengthenArray(optionTextsSpanish, optionCount, "");
  lengthenArray(optionTextsHmong, optionCount, "");
  lengthenArray(optionTextsSomali, optionCount, "");

  // create image data array
  const images =
    fields.images?.map((image, index) => ({
      src: image.url,
      alt: imageAlts[index] || "",
      width: image.width,
      height: image.height,
    })) || [];

  // return normalized data
  return {
    id,
    type,
    promptTextEnglish,
    promptTextSpanish,
    promptTextHmong,
    promtTextSomali,
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

export async function getConfiguration() {
  try {
    // load the most recent row from the configuration table where
    // the "active" checkbox is checked
    const configurations = await base("Configuration").select({
      maxRecords: 1,
      filterByFormula: "AND({active})",
      sort: [{ field: "updated", direction: "desc" }],
    });
    // await the first page, get the record
    const [record] = await configurations.firstPage();

    return {
      gallerySurveyId: record.fields.gallerySurvey?.[0] || false,
      homeSurveyId: record.fields.homeSurvey?.[0] || false,
      lobbySurveyId: record.fields.lobbySurvey?.[0] || false,
      galleryTimeout: record.fields.galleryTimeout || 60 * 5, // 5 minutes
      lobbySlideTime: record.fields.lobbySlideTime || 30, // 30 seconds
    };
  } catch (error) {
    console.log("Error loading configuration.\n", error);
    return [];
  }
}
