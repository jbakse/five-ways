import { PrismaClient } from "@prisma/client";
import pick from "lodash/pick";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await logResponse(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function logResponse(req, res) {
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
