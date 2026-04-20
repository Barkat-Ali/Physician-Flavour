import mongoose from "mongoose";
import Subscription from "../models/Subscription.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getSubscriptions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.json([]);
      return;
    }

    const subscriptions = await Subscription.find({}).sort({ createdAt: -1 }).lean();
    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
};

export const upsertSubscription = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error("Database connection is not available.");
    }

    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();
    const active = req.body.active !== false;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required.");
    }

    if (!isValidEmail(email)) {
      res.status(400);
      throw new Error("Invalid email format.");
    }

    if (password.length < 4) {
      res.status(400);
      throw new Error("Password must be at least 4 characters.");
    }

    const subscription = await Subscription.findOneAndUpdate(
      { email },
      { email, password, active },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    res.status(201).json({
      message: active ? "Subscribed successfully." : "Subscription updated as inactive.",
      subscription
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscriptionStatus = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error("Database connection is not available.");
    }

    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { active: Boolean(req.body.active) },
      { new: true }
    ).lean();

    if (!subscription) {
      res.status(404);
      throw new Error("Subscription not found.");
    }

    res.json({ message: "Subscription updated.", subscription });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error("Database connection is not available.");
    }

    const deleted = await Subscription.findByIdAndDelete(req.params.id).lean();

    if (!deleted) {
      res.status(404);
      throw new Error("Subscription not found.");
    }

    res.json({ message: "Subscription deleted." });
  } catch (error) {
    next(error);
  }
};