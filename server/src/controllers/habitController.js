import asyncHandler from "../utils/asyncHandler.js";
import { addDays, addMonths, startOfDay, startOfMonth, startOfWeek } from "../utils/dateRanges.js";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";

const HABIT_FREQUENCIES = ["daily", "weekly", "monthly"];
const HABIT_STATUSES = ["active", "paused", "completed"];

function normalizePeriodDate(date, frequency) {
  const parsedDate = date ? new Date(date) : new Date();

  if (frequency === "weekly") {
    return startOfWeek(parsedDate);
  }

  if (frequency === "monthly") {
    return startOfMonth(parsedDate);
  }

  return startOfDay(parsedDate);
}

function previousPeriod(date, frequency) {
  if (frequency === "weekly") {
    return addDays(date, -7);
  }

  if (frequency === "monthly") {
    return addMonths(date, -1);
  }

  return addDays(date, -1);
}

function expectedPeriodsSince(startDate, frequency) {
  const start = normalizePeriodDate(startDate, frequency);
  const today = normalizePeriodDate(new Date(), frequency);

  if (start > today) {
    return 0;
  }

  if (frequency === "monthly") {
    return (today.getFullYear() - start.getFullYear()) * 12 + today.getMonth() - start.getMonth() + 1;
  }

  const dayDifference = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const divisor = frequency === "weekly" ? 7 : 1;

  return Math.floor(dayDifference / divisor) + 1;
}

function validateHabitPayload(payload, partial = false) {
  if (!partial && !payload.habitName) {
    throw new Error("Habit name is required.");
  }

  if (payload.frequency && !HABIT_FREQUENCIES.includes(payload.frequency)) {
    throw new Error("Habit frequency must be daily, weekly, or monthly.");
  }

  if (payload.status && !HABIT_STATUSES.includes(payload.status)) {
    throw new Error("Habit status is not supported.");
  }

  if (payload.target !== undefined && Number(payload.target) < 1) {
    throw new Error("Habit target must be at least 1.");
  }
}

async function calculateHabitStats(habit) {
  const logs = await HabitLog.find({ habitId: habit._id, userId: habit.userId }).sort({ date: -1 }).lean();
  const completedLogs = logs.filter((log) => log.completed);
  const expected = expectedPeriodsSince(habit.createdAt || new Date(), habit.frequency);
  const completedCount = completedLogs.length;
  const missedCount = Math.max(expected - completedCount, 0);
  const completionRate = expected > 0 ? Math.round((completedCount / expected) * 100) : 0;
  const completedDates = new Set(completedLogs.map((log) => normalizePeriodDate(log.date, habit.frequency).toISOString()));
  let cursor = normalizePeriodDate(new Date(), habit.frequency);
  let streak = 0;

  while (completedDates.has(cursor.toISOString())) {
    streak += 1;
    cursor = previousPeriod(cursor, habit.frequency);
  }

  return {
    completionRate,
    completedCount,
    expectedCount: expected,
    missedCount,
    streak,
    latestLog: logs[0] || null
  };
}

async function mapHabitWithStats(habit) {
  const stats = await calculateHabitStats(habit);

  return {
    id: habit._id,
    habitName: habit.habitName,
    frequency: habit.frequency,
    target: habit.target,
    streak: stats.streak,
    status: habit.status,
    createdAt: habit.createdAt,
    updatedAt: habit.updatedAt,
    stats
  };
}

async function refreshHabitStreak(habit) {
  const stats = await calculateHabitStats(habit);
  habit.streak = stats.streak;
  await habit.save();
  return stats;
}

export const listHabits = asyncHandler(async (req, res) => {
  const filters = { userId: req.user._id };

  if (req.query.status) {
    filters.status = req.query.status;
  }

  if (req.query.frequency) {
    filters.frequency = req.query.frequency;
  }

  const habits = await Habit.find(filters).sort({ status: 1, createdAt: -1 });
  const mappedHabits = await Promise.all(habits.map(mapHabitWithStats));

  res.status(200).json({ habits: mappedHabits, summary: buildHabitSummary(mappedHabits) });
});

export const createHabit = asyncHandler(async (req, res) => {
  try {
    validateHabitPayload(req.body);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const habit = await Habit.create({
    userId: req.user._id,
    habitName: req.body.habitName,
    frequency: req.body.frequency || "daily",
    target: Number(req.body.target || 1),
    status: req.body.status || "active"
  });

  res.status(201).json({ habit: await mapHabitWithStats(habit) });
});

export const updateHabit = asyncHandler(async (req, res) => {
  try {
    validateHabitPayload(req.body, true);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found.");
  }

  res.status(200).json({ habit: await mapHabitWithStats(habit) });
});

export const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found.");
  }

  await HabitLog.deleteMany({ habitId: habit._id, userId: req.user._id });

  res.status(200).json({ message: "Habit deleted." });
});

export const logHabitCompletion = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found.");
  }

  const normalizedDate = normalizePeriodDate(req.body.date, habit.frequency);
  const completed = req.body.completed !== false;

  const log = await HabitLog.findOneAndUpdate(
    { habitId: habit._id, userId: req.user._id, date: normalizedDate },
    { completed },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const stats = await refreshHabitStreak(habit);

  res.status(200).json({
    log,
    habit: {
      id: habit._id,
      habitName: habit.habitName,
      frequency: habit.frequency,
      target: habit.target,
      streak: stats.streak,
      status: habit.status,
      stats
    }
  });
});

export const getHabitSummary = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 });
  const mappedHabits = await Promise.all(habits.map(mapHabitWithStats));

  res.status(200).json({ summary: buildHabitSummary(mappedHabits) });
});

function buildHabitSummary(habits) {
  const activeHabits = habits.filter((habit) => habit.status === "active");
  const completionRate = activeHabits.length
    ? Math.round(activeHabits.reduce((total, habit) => total + habit.stats.completionRate, 0) / activeHabits.length)
    : 0;
  const missedHabits = activeHabits.reduce((total, habit) => total + habit.stats.missedCount, 0);
  const bestStreak = habits.reduce((best, habit) => Math.max(best, habit.streak), 0);

  return {
    totalHabits: habits.length,
    activeHabits: activeHabits.length,
    completionRate,
    missedHabits,
    bestStreak
  };
}
