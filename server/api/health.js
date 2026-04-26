import { applyCors, ensureDatabaseConnection, sendMethodNotAllowed } from "../src/serverless/handlerUtils.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) {
    return;
  }

  await ensureDatabaseConnection();

  if (req.method !== "GET") {
    return sendMethodNotAllowed(res, ["GET"]);
  }

  return res.json({ status: "ok", service: "Physician Flavour API" });
}
