import { getDietSuggestions } from "../../src/controllers/dietController.js";
import { buildRequest, runController } from "../../src/serverless/controllerAdapter.js";
import {
  applyCors,
  ensureDatabaseConnection,
  getQuery,
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

  const request = buildRequest({ req, query: getQuery(req) });
  return runController({ controller: getDietSuggestions, req: request, res });
}
