import express from "express";
import { verifyAdminAccessKey } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const accessKey = req.body?.accessKey;

  if (!verifyAdminAccessKey(accessKey)) {
    res.status(401);
    throw new Error("Invalid admin access key.");
  }

  res.json({ message: "Admin login successful." });
});

export default router;
