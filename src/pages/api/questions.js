import { getQuestionData } from "../../lib/airtable";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return await getQuestion(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getQuestion(req, res) {
  if (!req.query.id) {
    return res.status(400).json({ success: false, message: "id required" });
  }

  const question = await getQuestionData(req.query.id);
  return res.status(200).json({ success: true, question });
}
