import { PrismaClient } from "@prisma/client";
import pick from "lodash/pick";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await upsertResponse(req, res);
  } else if (req.method === "GET") {
    return await listRepsonses(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function listRepsonses(req, res) {
  // from start of day
  const start = new Date(
    req.query.start ? req.query.start + "T00:00:00" : "2000-01-01"
  );

  // to END of day
  const end = new Date(
    req.query.end ? req.query.end + "T00:00:00" : "3000-01-01"
  );
  end.setDate(end.getDate() + 1);

  console.log(start, end);
  try {
    const responses = await prisma.response.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const responses_cleaned = JSON.parse(JSON.stringify(responses));

    return res
      .status(200)
      .json({ success: true, responses: responses_cleaned });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error listing responses", success: false });
  }
}
async function upsertResponse(req, res) {
  try {
    const response = await prisma.response.upsert({
      where: {
        responseId: pick(req.body, ["responderId", "surveyId", "questionId"]),
      },
      update: {
        selections: req.body.selections,
      },
      create: pick(req.body, [
        "responderId",
        "surveyId",
        "questionId",
        "selections",
      ]),
    });
    return res.status(200).json({ success: true, response: response });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error logging response", success: false });
  }
}
