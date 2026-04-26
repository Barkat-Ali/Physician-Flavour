import { createRecipe, getRecipes } from "../../src/controllers/recipeController.js";
import { buildRequest, runController } from "../../src/serverless/controllerAdapter.js";
import {
  applyCors,
  ensureDatabaseConnection,
  getQuery,
  parseJsonBody,
  sendMethodNotAllowed
} from "../../src/serverless/handlerUtils.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) {
    return;
  }

  await ensureDatabaseConnection();

  if (req.method === "GET") {
    const request = buildRequest({ req, query: getQuery(req) });
    return runController({ controller: getRecipes, req: request, res });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = parseJsonBody(req);
    } catch (_error) {
      return res.status(400).json({ message: "Invalid JSON body." });
    }

    const request = buildRequest({ req, body });
    return runController({ controller: createRecipe, req: request, res });
  }

  return sendMethodNotAllowed(res, ["GET", "POST"]);
}
