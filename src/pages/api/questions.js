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
      .json({ message: "Five Ways API: Method not allowed", success: false });
  }
}

async function getQuestion(id, request, response) {
  try {
    const question = await getQuestionData(id);
    return response.status(200).json({ success: true, question });
  } catch (error) {
    return response.status(404).json({
      message: "Five Ways API: Question not found",
      success: false,
      error,
    });
  }
}

async function getQuestions(request, response) {
  try {
    const questions = await listQuestions();
    return response.status(200).json({ success: true, questions });
  } catch (error) {
    return response.status(404).json({
      message: "Five Ways API: Listing Questions Failed",
      success: false,
      error,
    });
  }
}
