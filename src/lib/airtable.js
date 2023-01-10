import Airtable from "airtable";
import { padArray } from "./util";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

//////////////////////// QUESTIONS ////////////////////////

/**
 * given question `id` return shallow question data
 * defaults filled in when needed
 *
 * @throws if question is not found
 *
 * Airtable Question Schema
 *
 * string     | nickname                | human readable nickname (not unique!)
 * <<Survey   | Surveys                 | survey this question belongs too
 *
 * enum       | type                    | single, multiple, open
 *
 * string     | promptTextEnglish       |
 * string     | optionTextsEnglish      | newline delimited
 * string     | promptTextSpanish       |
 * string     | optionTextsSpanish      | newline delimited
 * string     | promptTextHmong         |
 * string     | optionTextsHmong        | newline delimited
 * string     | promtTextSomali         |
 * string     | optionTextsSomali       | newline delimited
 *
 * attach[]   | images                  | image attachments
 * string     | imagesAlts              | newline delimited
 *
 * date       | updated                 | last modified date
 */

export async function getQuestionData(id) {
  const { fields } = await base("Question").find(id);

  // normalize data
  const nickname = fields.nickname ?? "unnamed";
  const type = fields.type ?? "single";
  const promptTextEnglish = fields.promptTextEnglish?.trim() ?? "";
  const promptTextSpanish = fields.promptTextSpanish?.trim() ?? "";
  const promptTextHmong = fields.promptTextHmong?.trim() ?? "";
  const promtTextSomali = fields.promtTextSomali?.trim() ?? "";
  let optionTextsEnglish = fields.optionTextsEnglish?.trim().split("\n") ?? [];
  let optionTextsSpanish = fields.optionTextsSpanish?.trim().split("\n") ?? [];
  let optionTextsHmong = fields.optionTextsHmong?.trim().split("\n") ?? [];
  let optionTextsSomali = fields.optionTextsSomali?.trim().split("\n") ?? [];

  // remove empty strings
  optionTextsEnglish = optionTextsEnglish.filter((text) => text !== "");
  optionTextsSpanish = optionTextsSpanish.filter((text) => text !== "");
  optionTextsHmong = optionTextsHmong.filter((text) => text !== "");
  optionTextsSomali = optionTextsSomali.filter((text) => text !== "");

  let imageAlts = fields.imagesAlts?.trim().split("\n") ?? [];
  imageAlts = imageAlts.filter((text) => text !== "");

  // pad arrays with empty strings to make them all the same length
  const optionCount = Math.max(
    optionTextsEnglish.length,
    optionTextsSpanish.length,
    optionTextsHmong.length,
    optionTextsSomali.length,
    imageAlts.length
  );
  padArray(optionTextsEnglish, optionCount, "");
  padArray(optionTextsSpanish, optionCount, "");
  padArray(optionTextsHmong, optionCount, "");
  padArray(optionTextsSomali, optionCount, "");

  // create image data array
  const images =
    fields.images?.map((image, index) => ({
      src: image.url,
      width: image.width,
      height: image.height,
      alt: imageAlts[index] ?? "",
    })) ?? [];

  if (images.length > 0 && images.length !== optionCount) {
    console.warn(`Options and image counts do not match. ${nickname}`);
  }

  // return normalized data
  return {
    id,
    nickname,
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

/**
 * get question data for given array of question ids
 *
 * @throws if any question is not found
 */

async function getQuestionDatas(questionIds) {
  const questionPromises = questionIds.map(getQuestionData);
  const questions = await Promise.all(questionPromises);
  return questions;
}

/**
 * get *summary* data for every question in the database
 * sorted by last modified date
 * defaults filled in when needed
 *
 * @throws if airtable request fails
 */

export async function listQuestions() {
  const pages = await base("Question").select({
    fields: ["nickname", "type", "promptTextEnglish", "Surveys", "updated"],
    sort: [{ field: "updated", direction: "desc" }],
  });
  const questions = [];

  await pages.eachPage((records, fetchNextPage) => {
    for (const r of records) {
      questions.push({
        id: r.id,
        nickname: r.fields.nickname ?? "unnamed",
        type: r.fields.type ?? "single",
        prompt: r.fields.promptTextEnglish ?? "",
        Surveys: r.fields.Surveys ?? [],
        updated: r.fields.updated ?? new Date(),
      });
    }
    fetchNextPage();
  });

  return questions;
}

//////////////////////// Surveys ////////////////////////

/**
 * given survey `id` return survey data
 * defaults filled in when needed
 *
 * @throws if survey is not found
 *
 * Airtable Question Schema
 *
 * string      | nickname               | human readable nickname (not unique!)
 * <<Question  | Questions              | ordered questions in this survey
 * date        | updated                | last modified date
 *
 * */

async function getSurveyData(id) {
  const result = await base("Survey").find(id);
  return {
    id,
    nickname: result.fields.nickname ?? "unnamed",
    questionIds: result.fields.Questions ?? [],
  };
}

/**
 * get survey data AND related question data
 * defaults filled in when needed
 *
 * @throws if survey is not found
 * @throws if any question is not found
 */

export async function getSurveyDeep(surveyId) {
  const surveyData = await getSurveyData(surveyId);

  const questions = await getQuestionDatas(surveyData.questionIds);
  return {
    id: surveyId,
    nickname: surveyData.nickname,
    questions,
  };
}

/**
 * get *summary* data for every survey in the database
 * sorted by last modified date
 * defaults filled in when needed
 *
 * @throws if airtable request fails
 *
 */

export async function listSurveys() {
  const pages = await base("Survey").select({
    sort: [{ field: "updated", direction: "desc" }],
  });
  const surveys = [];
  await pages.eachPage((records, fetchNextPage) => {
    for (const r of records) {
      surveys.push({
        id: r.id,
        nickname: r.fields.nickname ?? "unnamed",
        updated: r.fields.updated ?? new Date(),
        questionCount: r.fields.Questions?.length ?? 0,
      });
    }
    fetchNextPage();
  });
  return surveys;
}

//////////////////////// Configuration ////////////////////////

/**
 * get configuration data from airtable
 * there should only be one active configuration in airtable at a time
 * defaults filled in when needed
 */

export async function getConfiguration() {
  let record;
  try {
    // load the most recent row from the configuration table where
    // the "active" checkbox is checked
    const configurations = await base("Configuration").select({
      maxRecords: 1,
      filterByFormula: "AND({active})",
      sort: [{ field: "updated", direction: "desc" }],
    });
    // await the first page, get the record
    record = (await configurations.firstPage())[0];
  } catch (error) {
    console.warn("Error loading configuration.\n", error);
  }

  const config = {
    gallerySurveyId: record?.fields?.gallerySurvey?.[0] ?? false,
    homeSurveyId: record?.fields?.homeSurvey?.[0] ?? false,
    lobbySurveyId: record?.fields?.lobbySurvey?.[0] ?? false,
    galleryTimeout: record?.fields?.galleryTimeout ?? 60 * 5, // 5 minutes
    lobbySlideTime: record?.fields?.lobbySlideTime ?? 30, // 30 seconds
  };

  return config;
}
