import { getSubscriptions, upsertSubscription } from "../../src/controllers/subscriptionController.js";
import { validateAdminAccess } from "../../src/middleware/adminAuth.js";
import { buildRequest, runController, runMiddleware } from "../../src/serverless/controllerAdapter.js";
import {
  applyCors,
  ensureDatabaseConnection,
  parseJsonBody,
  sendMethodNotAllowed
} from "../../src/serverless/handlerUtils.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) {
    return;
  }

  await ensureDatabaseConnection();

  if (req.method === "GET") {
    const request = buildRequest({ req });
    const isAuthorized = await runMiddleware({
      middleware: validateAdminAccess,
      req: request,
      res
    });

    if (!isAuthorized) {
      return;
    }

    return runController({ controller: getSubscriptions, req: request, res });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = parseJsonBody(req);
    } catch (_error) {
      return res.status(400).json({ message: "Invalid JSON body." });
    }

    const request = buildRequest({ req, body });
    return runController({ controller: upsertSubscription, req: request, res });
  }

  return sendMethodNotAllowed(res, ["GET", "POST"]);
}
