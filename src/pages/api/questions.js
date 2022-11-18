import { getQuestionData } from "../../lib/airtable";

export default async function handler(request, response) {
  if (request.method === "GET") {
    return await getQuestion(request, response);
  } else {
    return response
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getQuestion(request, response) {
  if (!request.query.id) {
    return response
      .status(400)
      .json({ success: false, message: "id required" });
  }

  const question = await getQuestionData(request.query.id);
  return response.status(200).json({ success: true, question });
}
