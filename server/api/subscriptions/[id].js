import {
  deleteSubscription,
  updateSubscriptionStatus
} from "../../src/controllers/subscriptionController.js";
import { validateAdminAccess } from "../../src/middleware/adminAuth.js";
import { buildRequest, runController, runMiddleware } from "../../src/serverless/controllerAdapter.js";
import {
  applyCors,
  ensureDatabaseConnection,
  getQuery,
  parseJsonBody,
  readParam,
  sendMethodNotAllowed
} from "../../src/serverless/handlerUtils.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) {
    return;
  }

  await ensureDatabaseConnection();

  if (req.method === "PATCH") {
    let body;
    try {
      body = parseJsonBody(req);
    } catch (_error) {
      return res.status(400).json({ message: "Invalid JSON body." });
    }

    const query = getQuery(req);
    const request = buildRequest({
      req,
      query,
      body,
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

    return runController({ controller: updateSubscriptionStatus, req: request, res });
  }

  if (req.method === "DELETE") {
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

    return runController({ controller: deleteSubscription, req: request, res });
  }

  return sendMethodNotAllowed(res, ["PATCH", "DELETE"]);
}
