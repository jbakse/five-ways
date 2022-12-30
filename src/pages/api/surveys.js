import { listSurveys, getSurveyDeep } from "../../lib/airtable";

export default async function handler(request, response) {
  if (request.method === "GET") {
    return await getSurveys(request, response);
  } else {
    return response
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

// todo: refactor into two functions liek questions.js

async function getSurveys(request, response) {
  if (request.query.id) {
    const survey = await getSurveyDeep(request.query.id);
    return response.status(200).json({ success: true, survey });
  } else {
    const surveys = await listSurveys();
    return response.status(200).json({ success: true, surveys });
  }
}
