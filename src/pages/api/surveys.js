import { listSurveys, getSurveyDeep } from "../../lib/airtable";

export default async function handler(request, response) {
  if (request.method === "GET") {
    if (request.query.id) {
      return await getSurvey(request.query.id, request, response);
    } else {
      return await getSurveys(request, response);
    }
  } else {
    return response
      .status(405)
      .json({ message: "Five Ways API: Method not allowed", success: false });
  }
}

async function getSurvey(id, request, response) {
  try {
    const survey = await getSurveyDeep(request.query.id);
    return response.status(200).json({ success: true, survey });
  } catch (error) {
    return response.status(404).json({
      message: "Five Ways API: Survey not found",
      success: false,
      error,
    });
  }
}

async function getSurveys(request, response) {
  try {
    const surveys = await listSurveys();
    return response.status(200).json({ success: true, surveys });
  } catch (error) {
    return response.status(404).json({
      message: "Five Ways API: Listing Surveys Failed",
      success: false,
      error,
    });
  }
}
