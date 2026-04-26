import { getPendingRecipes } from "../../../src/controllers/recipeController.js";
import { validateAdminAccess } from "../../../src/middleware/adminAuth.js";
import { buildRequest, runController, runMiddleware } from "../../../src/serverless/controllerAdapter.js";
import {
  applyCors,
  ensureDatabaseConnection,
  sendMethodNotAllowed
} from "../../../src/serverless/handlerUtils.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) {
    return;
  }

  await ensureDatabaseConnection();

  if (req.method !== "GET") {
    return sendMethodNotAllowed(res, ["GET"]);
  }

  const request = buildRequest({ req });
  const isAuthorized = await runMiddleware({
    middleware: validateAdminAccess,
    req: request,
    res
  });

  if (!isAuthorized) {
    return;
  }

  return runController({ controller: getPendingRecipes, req: request, res });
}
