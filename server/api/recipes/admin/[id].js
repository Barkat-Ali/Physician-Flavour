import { deleteRecipe } from "../../../src/controllers/recipeController.js";
import { validateAdminAccess } from "../../../src/middleware/adminAuth.js";
import { buildRequest, runController, runMiddleware } from "../../../src/serverless/controllerAdapter.js";
import {
  applyCors,
  ensureDatabaseConnection,
  getQuery,
  readParam,
  sendMethodNotAllowed
} from "../../../src/serverless/handlerUtils.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) {
    return;
  }

  await ensureDatabaseConnection();

  if (req.method !== "DELETE") {
    return sendMethodNotAllowed(res, ["DELETE"]);
  }

  const query = getQuery(req);
  const request = buildRequest({
    req,
    query,
    params: {
      id: readParam(query.id)
    }
  });

  const isAuthorized = await runMiddleware({
    middleware: validateAdminAccess,
    req: request,
    res
  });

  if (!isAuthorized) {
    return;
  }

  return runController({ controller: deleteRecipe, req: request, res });
}
