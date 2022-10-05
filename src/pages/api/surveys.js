import { getSurveys, getSurvey } from "../../lib/airtable";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return await listSurveys(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function listSurveys(req, res) {
  console.log(req.query);
  if (req.query.id) {
    const survey = await getSurvey(req.query.id);
    return res.status(200).json({ success: true, survey });
  } else {
    const surveys = await getSurveys();
    return res.status(200).json({ success: true, surveys });
  }
}