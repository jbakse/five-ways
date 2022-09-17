import { sendResponse } from "../../lib/airtable";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  console.log(req.body);
  const { responderId, surveyId, questionId, selections } = req.body;

  sendResponse(responderId, surveyId, questionId, selections);

  res.status(200).json({ success: true });
}
