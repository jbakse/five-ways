import { getSurveys, getSurveyDeep } from "../../lib/airtable";

export default async function handler(request, response) {
  if (request.method === "GET") {
    return await listSurveys(request, response);
  } else {
    return response
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function listSurveys(request, response) {
  if (request.query.id) {
    const survey = await getSurveyDeep(request.query.id);
    return response.status(200).json({ success: true, survey });
  } else {
    const surveys = await getSurveys();
    return response.status(200).json({ success: true, surveys });
  }
}
