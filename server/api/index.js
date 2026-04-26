import dotenv from "dotenv";
import app from "../src/app.js";
import connectDB from "../src/config/db.js";

dotenv.config();

let dbReady = false;

export default async function handler(req, res) {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }

  return app(req, res);
}
