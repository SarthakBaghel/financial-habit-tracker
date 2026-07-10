import asyncHandler from "../utils/asyncHandler.js";
import { Asset, Habit, Profile, SavingsGoal, Transaction } from "../models/index.js";

const MONTH_COUNT = 6;

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthProgress(date) {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return date.getDate() / daysInMonth;
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function buildMonthBuckets(count = MONTH_COUNT) {
  const currentMonth = startOfMonth(new Date());
  const firstMonth = addMonths(currentMonth, -(count - 1));

  return Array.from({ length: count }, (_, index) => {
    const date = addMonths(firstMonth, index);
    return {
      key: monthKey(date),
      label: monthLabel(date),
      date
    };
  });
}

function currencyFor(user) {
  return user.currencyPreference || "INR";
}

function percentage(numerator, denominator) {
  if (!denominator || denominator <= 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

function clampProgress(value) {
  return Math.max(0, Math.min(value, 100));
}

function currentAssetValue(assets) {
  const latestByAsset = new Map();

  assets.forEach((asset) => {
    const key = `${asset.type}:${asset.name}`;
    const existing = latestByAsset.get(key);

    if (!existing || new Date(asset.date) > new Date(existing.date)) {
      latestByAsset.set(key, asset);
    }
  });

  return Array.from(latestByAsset.values()).reduce((total, asset) => total + asset.value, 0);
}

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const monthBuckets = buildMonthBuckets();
  const firstBucketDate = monthBuckets[0].date;

  const [transactions, habits, savingsGoals, assets, profile] = await Promise.all([
    Transaction.find({ userId }).sort({ date: -1 }).lean(),
    Habit.find({ userId, status: "active" }).lean(),
    SavingsGoal.find({ userId }).sort({ deadline: 1, createdAt: -1 }).lean(),
    Asset.find({ userId }).sort({ date: -1 }).lean(),
    Profile.findOne({ userId }).lean()
  ]);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = percentage(netSavings, totalIncome);
  const currentMonthTransactions = transactions.filter((transaction) => new Date(transaction.date) >= currentMonthStart);
  const currentMonthIncome = currentMonthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const currentMonthExpenses = currentMonthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const currentMonthSavings = currentMonthIncome - currentMonthExpenses;
  const monthlyIncomeTarget = profile?.monthlyIncomeTarget || 0;
  const savingsTarget = profile?.savingsTarget || 0;
  const targetPace = monthProgress(now);
  const incomeOnTrack = !monthlyIncomeTarget || currentMonthIncome >= monthlyIncomeTarget * targetPace;
  const savingsOnTrack = !savingsTarget || currentMonthSavings >= savingsTarget * targetPace;
  const targetsMet = (!monthlyIncomeTarget || currentMonthIncome >= monthlyIncomeTarget)
    && (!savingsTarget || currentMonthSavings >= savingsTarget);
  const hasBaselineTargets = Boolean(monthlyIncomeTarget || savingsTarget);
  const baselineStatus = !hasBaselineTargets
    ? { label: "Set targets", tone: "neutral" }
    : targetsMet
      ? { label: "Target met", tone: "met" }
      : incomeOnTrack && savingsOnTrack
        ? { label: "On track", tone: "on_track" }
        : { label: "Behind target", tone: "behind" };

  const recentTransactions = transactions.slice(0, 6).map((transaction) => ({
    id: transaction._id,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
    note: transaction.note
  }));

  const categoryTotals = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((totals, transaction) => {
      totals.set(transaction.category, (totals.get(transaction.category) || 0) + transaction.amount);
      return totals;
    }, new Map());

  const categorySpending = Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const monthlyExpenseTotals = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));
  const monthlyNetTotals = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));

  transactions
    .filter((transaction) => new Date(transaction.date) >= firstBucketDate)
    .forEach((transaction) => {
      const key = monthKey(new Date(transaction.date));

      if (!monthlyNetTotals.has(key)) {
        return;
      }

      const signedAmount = transaction.type === "income" ? transaction.amount : -transaction.amount;
      monthlyNetTotals.set(key, monthlyNetTotals.get(key) + signedAmount);

      if (transaction.type === "expense") {
        monthlyExpenseTotals.set(key, monthlyExpenseTotals.get(key) + transaction.amount);
      }
    });

  const monthlyExpenses = monthBuckets.map((bucket) => ({
    month: bucket.label,
    amount: monthlyExpenseTotals.get(bucket.key) || 0
  }));

  const monthlyAssetTotals = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));

  assets
    .filter((asset) => new Date(asset.date) >= firstBucketDate)
    .forEach((asset) => {
      const key = monthKey(new Date(asset.date));

      if (monthlyAssetTotals.has(key)) {
        monthlyAssetTotals.set(key, monthlyAssetTotals.get(key) + asset.value);
      }
    });

  let runningSavings = 0;
  const wealthTrend = monthBuckets.map((bucket) => {
    runningSavings += monthlyNetTotals.get(bucket.key) || 0;

    return {
      month: bucket.label,
      value: Math.max(0, runningSavings + (monthlyAssetTotals.get(bucket.key) || 0))
    };
  });

  const goals = savingsGoals.slice(0, 5).map((goal) => ({
    id: goal._id,
    title: goal.title,
    category: goal.category,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    status: goal.status,
    deadline: goal.deadline,
    progress: clampProgress(percentage(goal.currentAmount, goal.targetAmount))
  }));

  const averageGoalProgress = goals.length
    ? Math.round(goals.reduce((total, goal) => total + goal.progress, 0) / goals.length)
    : 0;

  res.status(200).json({
    currency: currencyFor(req.user),
    summary: {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      activeHabits: habits.length,
      averageGoalProgress,
      currentAssetValue: currentAssetValue(assets),
      baseline: {
        monthlyIncome: currentMonthIncome,
        monthlyIncomeTarget,
        monthlyIncomeProgress: clampProgress(percentage(currentMonthIncome, monthlyIncomeTarget)),
        monthlyExpenses: currentMonthExpenses,
        monthlySavings: currentMonthSavings,
        savingsTarget,
        savingsProgress: clampProgress(percentage(Math.max(0, currentMonthSavings), savingsTarget)),
        status: baselineStatus
      }
    },
    charts: {
      wealthTrend,
      monthlyExpenses,
      categorySpending
    },
    goals,
    recentTransactions
  });
});
