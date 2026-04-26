import { getRecipeByName } from "../../src/controllers/recipeController.js";
import { buildRequest, runController } from "../../src/serverless/controllerAdapter.js";
import {
  applyCors,
  ensureDatabaseConnection,
  getQuery,
  readParam,
  sendMethodNotAllowed
} from "../../src/serverless/handlerUtils.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) {
    return;
  }

  await ensureDatabaseConnection();

  if (req.method !== "GET") {
    return sendMethodNotAllowed(res, ["GET"]);
  }

  const query = getQuery(req);
  const request = buildRequest({
    req,
    query,
    params: {
      name: readParam(query.name)
    }
  });

  return runController({ controller: getRecipeByName, req: request, res });
}
