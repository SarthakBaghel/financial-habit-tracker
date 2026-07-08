import asyncHandler from "../utils/asyncHandler.js";
import { Feedback, Habit, HabitLog, SavingsGoal, Transaction, User } from "../models/index.js";

export const getAdminSummary = asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    adminUsers,
    transactions,
    activeHabits,
    completedHabitLogs,
    activeSavingsGoals,
    openFeedback
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    Transaction.countDocuments(),
    Habit.countDocuments({ status: "active" }),
    HabitLog.countDocuments({ completed: true }),
    SavingsGoal.countDocuments({ status: "active" }),
    Feedback.countDocuments({ status: { $in: ["open", "in_review"] } })
  ]);

  res.status(200).json({
    totalUsers,
    userAccounts: Math.max(totalUsers - adminUsers, 0),
    adminUsers,
    transactions,
    activeHabits,
    completedHabitLogs,
    activeSavingsGoals,
    openFeedback
  });
});
