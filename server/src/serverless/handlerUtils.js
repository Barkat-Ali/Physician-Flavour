import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();

let dbReady = false;

const DEFAULT_ORIGIN = "http://localhost:5173";

const readHost = (req) => req.headers?.host || "localhost";

export const getQuery = (req) => {
  if (req.query && typeof req.query === "object") {
    return req.query;
  }

  const url = new URL(req.url || "/", `https://${readHost(req)}`);
  return Object.fromEntries(url.searchParams.entries());
};

export const readParam = (value) => {
  if (Array.isArray(value)) {
    return String(value[0] || "");
  }

  return String(value || "");
};

export const ensureDatabaseConnection = async () => {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }
};

export const applyCors = (req, res) => {
  const configuredOrigin = (process.env.CLIENT_URL || DEFAULT_ORIGIN).trim();
  const requestOrigin = req.headers?.origin || "";
  const corsOrigin =
    configuredOrigin === "*"
      ? "*"
      : requestOrigin && requestOrigin === configuredOrigin
        ? requestOrigin
        : configuredOrigin;

  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-key");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }

  return false;
};

export const parseJsonBody = (req) => {
  if (req.body == null) {
    return {};
  }

  if (typeof req.body === "string") {
    const text = req.body.trim();
    if (!text) {
      return {};
    }
    return JSON.parse(text);
  }

  if (typeof req.body === "object") {
    return req.body;
  }

  return {};
};

export const sendMethodNotAllowed = (res, allowedMethods) => {
  res.setHeader("Allow", allowedMethods.join(", "));
  return res.status(405).json({
    message: "Method not allowed",
    allowedMethods
  });
};
