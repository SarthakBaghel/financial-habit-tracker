import asyncHandler from "../utils/asyncHandler.js";
import { Asset, Feedback, Habit, HabitLog, SavingsGoal, Transaction, User } from "../models/index.js";

const ACTIVE_WINDOW_DAYS = 30;
const FEEDBACK_STATUSES = ["open", "in_review", "resolved", "closed"];

function sinceDate(days = ACTIVE_WINDOW_DAYS) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function rate(numerator, denominator) {
  if (!denominator || denominator <= 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

async function activeUserCount() {
  const since = sinceDate();
  const activityQueries = await Promise.all([
    Transaction.distinct("userId", { updatedAt: { $gte: since } }),
    Habit.distinct("userId", { updatedAt: { $gte: since } }),
    HabitLog.distinct("userId", { updatedAt: { $gte: since } }),
    SavingsGoal.distinct("userId", { updatedAt: { $gte: since } }),
    Asset.distinct("userId", { updatedAt: { $gte: since } }),
    Feedback.distinct("userId", { updatedAt: { $gte: since } })
  ]);

  return new Set(activityQueries.flat().map((id) => id.toString())).size;
}

async function latestActivityForUser(userId) {
  const latestRecords = await Promise.all([
    Transaction.findOne({ userId }).sort({ updatedAt: -1 }).select("updatedAt").lean(),
    Habit.findOne({ userId }).sort({ updatedAt: -1 }).select("updatedAt").lean(),
    HabitLog.findOne({ userId }).sort({ updatedAt: -1 }).select("updatedAt").lean(),
    SavingsGoal.findOne({ userId }).sort({ updatedAt: -1 }).select("updatedAt").lean(),
    Asset.findOne({ userId }).sort({ updatedAt: -1 }).select("updatedAt").lean(),
    Feedback.findOne({ userId }).sort({ updatedAt: -1 }).select("updatedAt").lean()
  ]);

  const timestamps = latestRecords
    .filter(Boolean)
    .map((record) => new Date(record.updatedAt).getTime());

  if (!timestamps.length) {
    return null;
  }

  return new Date(Math.max(...timestamps));
}

export const getAdminSummary = asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    adminUsers,
    activeUsers,
    transactionCount,
    assetCount,
    savingsGoalCount,
    completedSavingsGoals,
    totalHabitLogs,
    completedHabitLogs,
    activeHabits,
    openFeedback,
    inReviewFeedback,
    totalFeedback
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    activeUserCount(),
    Transaction.countDocuments(),
    Asset.countDocuments(),
    SavingsGoal.countDocuments(),
    SavingsGoal.countDocuments({ status: "completed" }),
    HabitLog.countDocuments(),
    HabitLog.countDocuments({ completed: true }),
    Habit.countDocuments({ status: "active" }),
    Feedback.countDocuments({ status: "open" }),
    Feedback.countDocuments({ status: "in_review" }),
    Feedback.countDocuments()
  ]);

  res.status(200).json({
    totalUsers,
    activeUsers,
    userAccounts: Math.max(totalUsers - adminUsers, 0),
    adminUsers,
    transactionCount,
    assetCount,
    savingsGoalCount,
    savingsGoalCompletionRate: rate(completedSavingsGoals, savingsGoalCount),
    activeHabits,
    totalHabitLogs,
    completedHabitLogs,
    habitCompletionRate: rate(completedHabitLogs, totalHabitLogs),
    openFeedback,
    inReviewFeedback,
    totalFeedback,
    platformUsage: {
      transactionCount,
      assetCount,
      savingsGoalCount,
      activeHabits,
      totalFeedback
    }
  });
});

export const listAdminUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();

  const userRows = await Promise.all(
    users.map(async (user) => {
      const [transactions, habits, goals, assets, feedback, latestActivity] = await Promise.all([
        Transaction.countDocuments({ userId: user._id }),
        Habit.countDocuments({ userId: user._id }),
        SavingsGoal.countDocuments({ userId: user._id }),
        Asset.countDocuments({ userId: user._id }),
        Feedback.countDocuments({ userId: user._id }),
        latestActivityForUser(user._id)
      ]);

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currencyPreference: user.currencyPreference,
        createdAt: user.createdAt,
        latestActivity,
        counts: {
          transactions,
          habits,
          goals,
          assets,
          feedback
        }
      };
    })
  );

  res.status(200).json({ users: userRows });
});

export const listAdminFeedback = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.status) {
    filters.status = req.query.status;
  }

  const feedback = await Feedback.find(filters)
    .populate("userId", "name email")
    .sort({ status: 1, createdAt: -1 })
    .lean();

  res.status(200).json({
    feedback: feedback.map((item) => ({
      id: item._id,
      message: item.message,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      user: item.userId
        ? {
            id: item.userId._id,
            name: item.userId.name,
            email: item.userId.email
          }
        : null
    })),
    statuses: FEEDBACK_STATUSES
  });
});

export const updateFeedbackStatus = asyncHandler(async (req, res) => {
  if (!FEEDBACK_STATUSES.includes(req.body.status)) {
    res.status(400);
    throw new Error("Feedback status is not supported.");
  }

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).populate("userId", "name email");

  if (!feedback) {
    res.status(404);
    throw new Error("Feedback item not found.");
  }

  res.status(200).json({
    feedback: {
      id: feedback._id,
      message: feedback.message,
      status: feedback.status,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      user: feedback.userId
        ? {
            id: feedback.userId._id,
            name: feedback.userId.name,
            email: feedback.userId.email
          }
        : null
    }
  });
});
