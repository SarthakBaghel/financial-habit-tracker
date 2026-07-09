import asyncHandler from "../utils/asyncHandler.js";
import { addMonths, monthKey, startOfMonth } from "../utils/dateRanges.js";
import { Asset, Habit, HabitLog, SavingsGoal, Transaction } from "../models/index.js";

const MONTH_COUNT = 6;

function buildMonthBuckets(count = MONTH_COUNT) {
  const currentMonth = startOfMonth(new Date());
  const firstMonth = addMonths(currentMonth, -(count - 1));

  return Array.from({ length: count }, (_, index) => {
    const date = addMonths(firstMonth, index);
    return {
      key: monthKey(date),
      label: date.toLocaleString("en-US", { month: "short" }),
      date
    };
  });
}

function percentage(numerator, denominator) {
  if (!denominator || denominator <= 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(value, max));
}

function calculateGoalProgress(goal) {
  return clamp(percentage(goal.currentAmount, goal.targetAmount));
}

function latestAssetValues(assets) {
  const latestByAsset = new Map();

  assets.forEach((asset) => {
    const key = `${asset.type}:${asset.name}`;
    const existing = latestByAsset.get(key);

    if (!existing || new Date(asset.date) > new Date(existing.date)) {
      latestByAsset.set(key, asset);
    }
  });

  return Array.from(latestByAsset.values());
}

function buildInsights({ savingsRate, netWorth, totalExpenses, totalIncome, habitCompletionRate, averageGoalProgress }) {
  const insights = [];

  if (totalIncome === 0) {
    insights.push("Add income records to unlock savings-rate and cash-flow insights.");
  } else if (savingsRate >= 30) {
    insights.push("Your savings rate is strong. Keep directing surplus cash toward goals or assets.");
  } else if (savingsRate >= 10) {
    insights.push("Your savings rate is positive. A small expense reduction can accelerate wealth growth.");
  } else {
    insights.push("Your savings rate is low. Review expense categories and set one weekly spending habit.");
  }

  if (totalExpenses > totalIncome && totalIncome > 0) {
    insights.push("Expenses are currently higher than income. Prioritize reducing flexible spending categories.");
  }

  if (netWorth > 0) {
    insights.push("Your tracked net worth is positive. Keep asset values updated monthly for a clearer trend.");
  } else {
    insights.push("Add savings, investments, or assets to begin tracking net worth over time.");
  }

  if (habitCompletionRate >= 70) {
    insights.push("Habit consistency is healthy. Regular tracking is supporting better financial awareness.");
  } else {
    insights.push("Habit completion has room to improve. Start with one daily habit like logging expenses.");
  }

  if (averageGoalProgress >= 50) {
    insights.push("Savings goals are making visible progress. Update saved amounts whenever you contribute.");
  } else {
    insights.push("Savings goals are early-stage. Consider adding smaller milestones to build momentum.");
  }

  return insights;
}

export const getWealthAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const monthBuckets = buildMonthBuckets();
  const firstBucketDate = monthBuckets[0].date;

  const [transactions, assets, goals, habits, habitLogs] = await Promise.all([
    Transaction.find({ userId }).sort({ date: -1 }).lean(),
    Asset.find({ userId }).sort({ date: -1 }).lean(),
    SavingsGoal.find({ userId }).sort({ deadline: 1, createdAt: -1 }).lean(),
    Habit.find({ userId }).lean(),
    HabitLog.find({ userId }).lean()
  ]);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = percentage(totalSavings, totalIncome);

  const currentAssets = latestAssetValues(assets);
  const totalSavingsAssets = currentAssets
    .filter((asset) => asset.type === "savings")
    .reduce((total, asset) => total + asset.value, 0);
  const investmentValue = currentAssets
    .filter((asset) => asset.type === "investment")
    .reduce((total, asset) => total + asset.value, 0);
  const otherAssetValue = currentAssets
    .filter((asset) => asset.type === "asset")
    .reduce((total, asset) => total + asset.value, 0);
  const totalAssetValue = totalSavingsAssets + investmentValue + otherAssetValue;
  const netWorth = Math.max(totalSavings + totalAssetValue, 0);

  const monthlyIncome = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));
  const monthlyExpenses = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));
  const monthlyNetSavings = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));
  const monthlyAssets = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));
  const monthlyHabitCompleted = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));
  const monthlyHabitTotal = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));

  transactions
    .filter((transaction) => new Date(transaction.date) >= firstBucketDate)
    .forEach((transaction) => {
      const key = monthKey(new Date(transaction.date));

      if (!monthlyIncome.has(key)) {
        return;
      }

      if (transaction.type === "income") {
        monthlyIncome.set(key, monthlyIncome.get(key) + transaction.amount);
        monthlyNetSavings.set(key, monthlyNetSavings.get(key) + transaction.amount);
      } else {
        monthlyExpenses.set(key, monthlyExpenses.get(key) + transaction.amount);
        monthlyNetSavings.set(key, monthlyNetSavings.get(key) - transaction.amount);
      }
    });

  assets
    .filter((asset) => new Date(asset.date) >= firstBucketDate)
    .forEach((asset) => {
      const key = monthKey(new Date(asset.date));

      if (monthlyAssets.has(key)) {
        monthlyAssets.set(key, monthlyAssets.get(key) + asset.value);
      }
    });

  habitLogs
    .filter((log) => new Date(log.date) >= firstBucketDate)
    .forEach((log) => {
      const key = monthKey(new Date(log.date));

      if (!monthlyHabitTotal.has(key)) {
        return;
      }

      monthlyHabitTotal.set(key, monthlyHabitTotal.get(key) + 1);

      if (log.completed) {
        monthlyHabitCompleted.set(key, monthlyHabitCompleted.get(key) + 1);
      }
    });

  let runningNetSavings = 0;
  const netWorthTrend = monthBuckets.map((bucket) => {
    runningNetSavings += monthlyNetSavings.get(bucket.key) || 0;

    return {
      month: bucket.label,
      netWorth: Math.max(runningNetSavings + (monthlyAssets.get(bucket.key) || 0), 0)
    };
  });

  const monthlyActivity = monthBuckets.map((bucket) => {
    const income = monthlyIncome.get(bucket.key) || 0;
    const expenses = monthlyExpenses.get(bucket.key) || 0;

    return {
      month: bucket.label,
      income,
      expenses,
      netSavings: income - expenses
    };
  });

  const savingsRateTrend = monthlyActivity.map((month) => ({
    month: month.month,
    savingsRate: percentage(month.netSavings, month.income)
  }));

  const savingsGoalProgress = goals.map((goal) => ({
    id: goal._id,
    title: goal.title,
    progress: calculateGoalProgress(goal),
    currentAmount: goal.currentAmount,
    targetAmount: goal.targetAmount
  }));

  const habitCompletion = monthBuckets.map((bucket) => ({
    month: bucket.label,
    completionRate: percentage(monthlyHabitCompleted.get(bucket.key), monthlyHabitTotal.get(bucket.key)),
    completed: monthlyHabitCompleted.get(bucket.key) || 0,
    total: monthlyHabitTotal.get(bucket.key) || 0
  }));

  const habitCompletionRate = percentage(
    habitLogs.filter((log) => log.completed).length,
    habitLogs.length
  );
  const averageGoalProgress = savingsGoalProgress.length
    ? Math.round(savingsGoalProgress.reduce((total, goal) => total + goal.progress, 0) / savingsGoalProgress.length)
    : 0;

  res.status(200).json({
    currency: req.user.currencyPreference || "INR",
    summary: {
      totalSavings,
      totalSavingsAssets,
      investmentValue,
      otherAssetValue,
      totalAssetValue,
      netWorth,
      savingsRate,
      totalIncome,
      totalExpenses,
      activeHabits: habits.filter((habit) => habit.status === "active").length,
      habitCompletionRate,
      averageGoalProgress
    },
    charts: {
      netWorthTrend,
      monthlyActivity,
      savingsRateTrend,
      goalProgress: savingsGoalProgress,
      habitCompletion
    },
    assets: currentAssets.map((asset) => ({
      id: asset._id,
      name: asset.name,
      type: asset.type,
      value: asset.value,
      date: asset.date
    })),
    insights: buildInsights({
      savingsRate,
      netWorth,
      totalExpenses,
      totalIncome,
      habitCompletionRate,
      averageGoalProgress
    })
  });
});
