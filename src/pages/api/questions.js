import { getQuestionData, listQuestions } from "../../lib/airtable";

export default async function handler(request, response) {
  if (request.method === "GET") {
    if (request.query.id) {
      return await getQuestion(request.query.id, request, response);
    } else {
      return await getQuestions(request, response);
    }
  } else {
    return response
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getQuestion(id, request, response) {
  const question = await getQuestionData(id);
  // todo error handling
  return response.status(200).json({ success: true, question });
}

async function getQuestions(request, response) {
  console.log("getQuestions");
  const questions = await listQuestions();
  console.log("questions", questions);
  // todo error handling
  return response.status(200).json({ success: true, questions });
}
