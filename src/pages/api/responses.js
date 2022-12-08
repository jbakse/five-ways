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
  // from start of day
  const start = new Date(
    request.query.start ? request.query.start + "T00:00:00" : "2000-01-01"
  );

  // to END of day
  const end = new Date(
    request.query.end ? request.query.end + "T00:00:00" : "3000-01-01"
  );
  end.setDate(end.getDate() + 1);

  const filters = {};
  if (request.query.questionId) {
    filters.questionId = { equals: request.query.questionId };
  }

  try {
    const responses = await prisma.response.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
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
    response
      .status(500)
      .json({ error: "Error listing responses", success: false });
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
    response
      .status(500)
      .json({
        error: "Error logging response",
        success: false,
        details: error,
      });
  }
}
