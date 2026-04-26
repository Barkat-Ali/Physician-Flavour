import { verifyAdminAccessKey } from "../../src/middleware/adminAuth.js";
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

  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  let body;
  try {
    body = parseJsonBody(req);
  } catch (_error) {
    return res.status(400).json({ message: "Invalid JSON body." });
  }

  const accessKey = body?.accessKey;

  if (!verifyAdminAccessKey(accessKey)) {
    return res.status(401).json({ message: "Invalid admin access key." });
  }

  return res.json({ message: "Admin login successful." });
}
