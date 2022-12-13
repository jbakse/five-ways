import { PrismaClient } from "@prisma/client";
import pick from "lodash/pick";

const prisma = new PrismaClient();

export default async function handler(request, response) {
  if (request.method === "POST") {
    return await upsertResponse(request, response);
  } else if (request.method === "GET") {
    return await listRepsonses(request, response);
  } else {
    return response
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function listRepsonses(request, response) {
  console.log("request.query", request.query);

  // from START of day
  const startDate = new Date(
    request.query.startDate
      ? request.query.startDate + "T00:00:00"
      : "2000-01-01"
  );

  // to END of day
  const endDate = new Date(
    request.query.endDate ? request.query.endDate + "T00:00:00" : "3000-01-01"
  );
  endDate.setDate(endDate.getDate() + 1);

  const filters = {};
  if (request.query.questionId) {
    filters.questionId = { equals: request.query.questionId };
  }
  if (request.query.surveyId) {
    filters.surveyId = { equals: request.query.surveyId };
  }
  if (request.query.responderId) {
    filters.responderId = { equals: request.query.responderId };
  }
  if (request.query.language) {
    filters.language = { equals: request.query.language };
  }

  try {
    const responses = await prisma.response.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...filters,
      },
    });

    const responses_cleaned = JSON.parse(JSON.stringify(responses));

    return response
      .status(200)
      .json({ success: true, responses: responses_cleaned });
  } catch (error) {
    console.error("Request error", error);
    response.status(500).json({
      error: "Error listing responses",
      success: false,
      details: error,
    });
  }
}
async function upsertResponse(request, response) {
  try {
    const prismaResponse = await prisma.response.upsert({
      where: {
        responseId: pick(request.body, [
          "responderId",
          "surveyId",
          "questionId",
        ]),
      },
      update: {
        selections: request.body.selections,
        language: request.body.language,
      },
      create: pick(request.body, [
        "responderId",
        "surveyId",
        "questionId",
        "selections",
        "language",
      ]),
    });

    return response
      .status(200)
      .json({ success: true, response: prismaResponse });
  } catch (error) {
    console.error("Request error", error);
    response.status(500).json({
      error: "Error logging response",
      success: false,
      details: error,
    });
  }
}
