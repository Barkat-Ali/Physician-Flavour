import express from "express";
import {
  deleteSubscription,
  getSubscriptions,
  updateSubscriptionStatus,
  upsertSubscription
} from "../controllers/subscriptionController.js";
import { validateAdminAccess } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", validateAdminAccess, getSubscriptions);
router.post("/", upsertSubscription);
router.patch("/:id", validateAdminAccess, updateSubscriptionStatus);
router.delete("/:id", validateAdminAccess, deleteSubscription);

export default router;