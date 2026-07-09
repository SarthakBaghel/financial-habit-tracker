import asyncHandler from "../utils/asyncHandler.js";
import SavingsGoal from "../models/SavingsGoal.js";

const GOAL_STATUSES = ["active", "completed", "paused"];

function percentage(numerator, denominator) {
  if (!denominator || denominator <= 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(value, max));
}

function goalProgress(goal) {
  return clamp(percentage(goal.currentAmount, goal.targetAmount));
}

function goalDisplayStatus(goal) {
  const progress = goalProgress(goal);

  if (goal.status === "completed" || progress >= 100) {
    return "Completed";
  }

  if (goal.status === "paused") {
    return "Paused";
  }

  if (!goal.deadline) {
    return "On track";
  }

  const createdAt = new Date(goal.createdAt || new Date());
  const deadline = new Date(goal.deadline);
  const today = new Date();

  if (today > deadline) {
    return "Behind";
  }

  const totalDuration = deadline - createdAt;

  if (totalDuration <= 0) {
    return progress > 0 ? "On track" : "Behind";
  }

  const elapsedDuration = today - createdAt;
  const expectedProgress = clamp(Math.round((elapsedDuration / totalDuration) * 100));

  return progress + 5 >= expectedProgress ? "On track" : "Behind";
}

function normalizeGoalPayload(payload, partial = false) {
  const normalized = {};

  if (!partial && !payload.title) {
    throw new Error("Goal title is required.");
  }

  if (!partial && payload.targetAmount === undefined) {
    throw new Error("Target amount is required.");
  }

  if (payload.title !== undefined) {
    normalized.title = payload.title;
  }

  if (payload.targetAmount !== undefined) {
    const targetAmount = Number(payload.targetAmount);

    if (targetAmount < 1) {
      throw new Error("Target amount must be greater than zero.");
    }

    normalized.targetAmount = targetAmount;
  }

  if (payload.currentAmount !== undefined) {
    const currentAmount = Number(payload.currentAmount);

    if (currentAmount < 0) {
      throw new Error("Current amount cannot be negative.");
    }

    normalized.currentAmount = currentAmount;
  }

  if (payload.deadline !== undefined) {
    normalized.deadline = payload.deadline || undefined;
  }

  if (payload.category !== undefined) {
    normalized.category = payload.category || "General";
  }

  if (payload.status !== undefined) {
    if (!GOAL_STATUSES.includes(payload.status)) {
      throw new Error("Goal status is not supported.");
    }

    normalized.status = payload.status;
  }

  return normalized;
}

function withComputedStatus(payload) {
  const nextPayload = { ...payload };

  if (
    nextPayload.targetAmount !== undefined &&
    nextPayload.currentAmount !== undefined &&
    nextPayload.currentAmount >= nextPayload.targetAmount
  ) {
    nextPayload.status = "completed";
  }

  return nextPayload;
}

function mapGoal(goal) {
  const progress = goalProgress(goal);

  return {
    id: goal._id,
    title: goal.title,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    remainingAmount: Math.max(goal.targetAmount - goal.currentAmount, 0),
    deadline: goal.deadline,
    category: goal.category,
    status: goal.status,
    displayStatus: goalDisplayStatus(goal),
    progress,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt
  };
}

function calculateSummary(goals) {
  const activeGoals = goals.filter((goal) => goal.status === "active");
  const completedGoals = goals.filter((goal) => goal.status === "completed" || goalProgress(goal) >= 100);
  const behindGoals = goals.filter((goal) => goalDisplayStatus(goal) === "Behind");
  const totalTarget = goals.reduce((total, goal) => total + goal.targetAmount, 0);
  const totalSaved = goals.reduce((total, goal) => total + goal.currentAmount, 0);

  return {
    totalGoals: goals.length,
    activeGoals: activeGoals.length,
    completedGoals: completedGoals.length,
    behindGoals: behindGoals.length,
    totalTarget,
    totalSaved,
    remainingAmount: Math.max(totalTarget - totalSaved, 0),
    averageProgress: goals.length
      ? Math.round(goals.reduce((total, goal) => total + goalProgress(goal), 0) / goals.length)
      : 0
  };
}

export const listSavingsGoals = asyncHandler(async (req, res) => {
  const filters = { userId: req.user._id };

  if (req.query.status) {
    filters.status = req.query.status;
  }

  const goals = await SavingsGoal.find(filters).sort({ status: 1, deadline: 1, createdAt: -1 }).lean();

  res.status(200).json({
    goals: goals.map(mapGoal),
    summary: calculateSummary(goals)
  });
});

export const createSavingsGoal = asyncHandler(async (req, res) => {
  let payload;

  try {
    payload = withComputedStatus(normalizeGoalPayload(req.body));
  } catch (error) {
    res.status(400);
    throw error;
  }

  const goal = await SavingsGoal.create({
    userId: req.user._id,
    ...payload
  });

  res.status(201).json({ goal: mapGoal(goal) });
});

export const updateSavingsGoal = asyncHandler(async (req, res) => {
  let payload;

  try {
    payload = normalizeGoalPayload(req.body, true);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const existingGoal = await SavingsGoal.findOne({ _id: req.params.id, userId: req.user._id });

  if (!existingGoal) {
    res.status(404);
    throw new Error("Savings goal not found.");
  }

  const mergedPayload = withComputedStatus({
    targetAmount: existingGoal.targetAmount,
    currentAmount: existingGoal.currentAmount,
    ...payload
  });

  Object.assign(existingGoal, payload, {
    status: mergedPayload.status || payload.status || existingGoal.status
  });

  await existingGoal.save();

  res.status(200).json({ goal: mapGoal(existingGoal) });
});

export const updateSavingsGoalProgress = asyncHandler(async (req, res) => {
  const currentAmount = Number(req.body.currentAmount);

  if (Number.isNaN(currentAmount) || currentAmount < 0) {
    res.status(400);
    throw new Error("Current amount must be a non-negative number.");
  }

  const goal = await SavingsGoal.findOne({ _id: req.params.id, userId: req.user._id });

  if (!goal) {
    res.status(404);
    throw new Error("Savings goal not found.");
  }

  goal.currentAmount = currentAmount;

  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = "completed";
  } else if (goal.status === "completed") {
    goal.status = "active";
  }

  await goal.save();

  res.status(200).json({ goal: mapGoal(goal) });
});

export const deleteSavingsGoal = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!goal) {
    res.status(404);
    throw new Error("Savings goal not found.");
  }

  res.status(200).json({ message: "Savings goal deleted." });
});
