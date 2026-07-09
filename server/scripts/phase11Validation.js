import assert from "node:assert/strict";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../src/app.js";
import connectDatabase from "../src/config/database.js";
import {
  Asset,
  Feedback,
  Habit,
  HabitLog,
  Profile,
  SavingsGoal,
  Transaction,
  User
} from "../src/models/index.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const runId = `phase11-${Date.now()}`;
const testEmail = `${runId}@example.com`;
const testPassword = "Phase11Password123";
const testDate = new Date().toISOString().slice(0, 10);
const testMonth = testDate.slice(0, 7);
const nextYearDeadline = `${Number(testDate.slice(0, 4)) + 1}-12-31`;
let server;
let baseUrl;
let testUserId;
let passedChecks = 0;

function check(name, action) {
  return action().then(() => {
    passedChecks += 1;
    console.log(`PASS ${name}`);
  });
}

async function request(method, path, { body, token } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const rawBody = await response.text();

  return {
    status: response.status,
    body: rawBody ? JSON.parse(rawBody) : null
  };
}

async function expectStatus(method, path, expectedStatus, options) {
  const response = await request(method, path, options);
  assert.equal(
    response.status,
    expectedStatus,
    `${method} ${path} expected ${expectedStatus}, received ${response.status}: ${response.body?.message || "No message"}`
  );
  return response.body;
}

async function clearTestData() {
  const user = testUserId ? { _id: testUserId } : { email: testEmail };
  const persistedUser = await User.findOne(user).select("_id").lean();

  if (!persistedUser) {
    return;
  }

  const userId = persistedUser._id;

  await Promise.all([
    Transaction.deleteMany({ userId }),
    HabitLog.deleteMany({ userId }),
    Habit.deleteMany({ userId }),
    SavingsGoal.deleteMany({ userId }),
    Asset.deleteMany({ userId }),
    Feedback.deleteMany({ userId }),
    Profile.deleteMany({ userId })
  ]);
  await User.deleteOne({ _id: userId });
}

async function startValidationServer() {
  await connectDatabase();

  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}/api`;
}

async function stopValidationServer() {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }

  await mongoose.disconnect();
}

async function run() {
  await startValidationServer();

  let token;
  let mainIncome;
  let bonusIncome;
  let rentExpense;
  let foodExpense;
  let emergencyGoal;
  let vacationGoal;
  let dailyHabit;
  let temporaryHabit;
  let investmentAsset;
  let temporaryAsset;
  let feedbackId;

  try {
    await check("health endpoint is reachable", async () => {
      const body = await expectStatus("GET", "/health", 200);
      assert.equal(body.status, "ok");
    });

    await check("protected endpoints reject missing tokens", async () => {
      await expectStatus("GET", "/dashboard/overview", 401);
    });

    await check("registration validates incomplete input", async () => {
      const body = await expectStatus("POST", "/auth/register", 400, {
        body: { name: "Only Name" }
      });
      assert.match(body.message, /required/i);
    });

    await check("a user can register and receive a session", async () => {
      const body = await expectStatus("POST", "/auth/register", 201, {
        body: {
          name: "Phase 11 Validation User",
          email: testEmail,
          password: testPassword,
          currencyPreference: "INR"
        }
      });
      assert.ok(body.token);
      assert.equal(body.user.email, testEmail);
      assert.equal(body.profile.userId.toString(), body.user.id.toString());
      token = body.token;
      testUserId = body.user.id;
    });

    await check("duplicate registrations are rejected", async () => {
      await expectStatus("POST", "/auth/register", 409, {
        body: {
          name: "Duplicate User",
          email: testEmail,
          password: testPassword,
          currencyPreference: "INR"
        }
      });
    });

    await check("login rejects incorrect passwords", async () => {
      await expectStatus("POST", "/auth/login", 401, {
        body: { email: testEmail, password: "not-the-right-password" }
      });
    });

    await check("registered users can log in and load their session", async () => {
      const login = await expectStatus("POST", "/auth/login", 200, {
        body: { email: testEmail, password: testPassword }
      });
      token = login.token;
      const session = await expectStatus("GET", "/auth/me", 200, { token });
      assert.equal(session.user.email, testEmail);
    });

    await check("profile setup persists financial preferences", async () => {
      const body = await expectStatus("PUT", "/profile", 200, {
        token,
        body: {
          monthlyIncomeTarget: 90000,
          savingsTarget: 30000,
          riskPreference: "moderate",
          financialGoals: [{ title: "Emergency fund", priority: "high", status: "active" }]
        }
      });
      assert.equal(body.profile.monthlyIncomeTarget, 90000);
      assert.equal(body.profile.savingsTarget, 30000);
    });

    await check("transaction input validation rejects invalid expense data", async () => {
      const body = await expectStatus("POST", "/transactions", 400, {
        token,
        body: { type: "expense", category: "Food", amount: -10, date: testDate }
      });
      assert.match(body.message, /negative/i);
    });

    await check("income records can be created, edited, and deleted", async () => {
      const main = await expectStatus("POST", "/transactions", 201, {
        token,
        body: { type: "income", category: "Salary", amount: 90000, date: testDate, note: "Monthly salary" }
      });
      mainIncome = main.transaction;

      const bonus = await expectStatus("POST", "/transactions", 201, {
        token,
        body: { type: "income", category: "Freelance", amount: 5000, date: testDate, note: "One-time work" }
      });
      bonusIncome = bonus.transaction;

      const updated = await expectStatus("PUT", `/transactions/${bonusIncome.id}`, 200, {
        token,
        body: { amount: 7500, note: "Updated one-time work" }
      });
      assert.equal(updated.transaction.amount, 7500);

      await expectStatus("DELETE", `/transactions/${bonusIncome.id}`, 200, { token });
    });

    await check("expense records can be created and edited", async () => {
      const rent = await expectStatus("POST", "/transactions", 201, {
        token,
        body: { type: "expense", category: "Rent", amount: 22000, date: testDate, note: "Monthly rent" }
      });
      rentExpense = rent.transaction;

      const updatedRent = await expectStatus("PUT", `/transactions/${rentExpense.id}`, 200, {
        token,
        body: { amount: 20000 }
      });
      assert.equal(updatedRent.transaction.amount, 20000);

      const food = await expectStatus("POST", "/transactions", 201, {
        token,
        body: { type: "expense", category: "Food", amount: 8000, date: testDate, note: "Groceries and meals" }
      });
      foodExpense = food.transaction;
    });

    await check("transaction filters and calculated summaries are accurate", async () => {
      const body = await expectStatus("GET", `/transactions?month=${testMonth}`, 200, { token });
      assert.equal(body.summary.totalIncome, 90000);
      assert.equal(body.summary.totalExpenses, 28000);
      assert.equal(body.summary.netSavings, 62000);
      assert.equal(body.summary.savingsRate, 69);
      assert.equal(body.summary.categoryTotals.Rent, 20000);
      assert.equal(body.summary.categoryTotals.Food, 8000);
      assert.equal(body.transactions.length, 3);
      assert.ok(body.transactions.some((transaction) => transaction.id === mainIncome.id));
      assert.ok(body.transactions.some((transaction) => transaction.id === foodExpense.id));
    });

    await check("savings goals support create, progress update, completion, and deletion", async () => {
      const created = await expectStatus("POST", "/savings-goals", 201, {
        token,
        body: {
          title: "Emergency Fund",
          targetAmount: 100000,
          currentAmount: 20000,
          deadline: nextYearDeadline,
          category: "Emergency Fund"
        }
      });
      emergencyGoal = created.goal;
      assert.equal(emergencyGoal.progress, 20);

      const progress = await expectStatus("PATCH", `/savings-goals/${emergencyGoal.id}/progress`, 200, {
        token,
        body: { currentAmount: 55000 }
      });
      assert.equal(progress.goal.progress, 55);

      const completed = await expectStatus("PATCH", `/savings-goals/${emergencyGoal.id}/progress`, 200, {
        token,
        body: { currentAmount: 100000 }
      });
      assert.equal(completed.goal.status, "completed");
      assert.equal(completed.goal.displayStatus, "Completed");

      const extra = await expectStatus("POST", "/savings-goals", 201, {
        token,
        body: { title: "Vacation", targetAmount: 50000, currentAmount: 5000, category: "Travel" }
      });
      vacationGoal = extra.goal;

      const updated = await expectStatus("PUT", `/savings-goals/${vacationGoal.id}`, 200, {
        token,
        body: { category: "Travel Fund" }
      });
      assert.equal(updated.goal.category, "Travel Fund");
      await expectStatus("DELETE", `/savings-goals/${vacationGoal.id}`, 200, { token });
    });

    await check("habits can be created, completed, updated, and deleted", async () => {
      const created = await expectStatus("POST", "/habits", 201, {
        token,
        body: { habitName: "Log expenses", frequency: "daily", target: 1 }
      });
      dailyHabit = created.habit;

      const completion = await expectStatus("POST", `/habits/${dailyHabit.id}/log`, 200, {
        token,
        body: { completed: true }
      });
      assert.equal(completion.habit.streak, 1);
      assert.equal(completion.habit.stats.completedCount, 1);

      const temporary = await expectStatus("POST", "/habits", 201, {
        token,
        body: { habitName: "Review budget", frequency: "weekly", target: 1 }
      });
      temporaryHabit = temporary.habit;

      const updated = await expectStatus("PUT", `/habits/${temporaryHabit.id}`, 200, {
        token,
        body: { status: "paused" }
      });
      assert.equal(updated.habit.status, "paused");
      await expectStatus("DELETE", `/habits/${temporaryHabit.id}`, 200, { token });

      const summary = await expectStatus("GET", "/habits/summary", 200, { token });
      assert.equal(summary.summary.activeHabits, 1);
      assert.equal(summary.summary.bestStreak, 1);
    });

    await check("assets support create, update, and delete", async () => {
      const created = await expectStatus("POST", "/assets", 201, {
        token,
        body: { name: "Mutual Fund Portfolio", type: "investment", value: 120000, date: testDate }
      });
      investmentAsset = created.asset;

      const updated = await expectStatus("PUT", `/assets/${investmentAsset.id}`, 200, {
        token,
        body: { value: 125000 }
      });
      assert.equal(updated.asset.value, 125000);

      const temporary = await expectStatus("POST", "/assets", 201, {
        token,
        body: { name: "Cash Buffer", type: "savings", value: 15000, date: testDate }
      });
      temporaryAsset = temporary.asset;
      await expectStatus("DELETE", `/assets/${temporaryAsset.id}`, 200, { token });
    });

    await check("dashboard returns the expected financial calculations and chart data", async () => {
      const body = await expectStatus("GET", "/dashboard/overview", 200, { token });
      assert.equal(body.summary.totalIncome, 90000);
      assert.equal(body.summary.totalExpenses, 28000);
      assert.equal(body.summary.netSavings, 62000);
      assert.equal(body.summary.savingsRate, 69);
      assert.equal(body.summary.activeHabits, 1);
      assert.equal(body.summary.averageGoalProgress, 100);
      assert.equal(body.summary.currentAssetValue, 125000);
      assert.equal(body.charts.wealthTrend.length, 6);
      assert.equal(body.charts.monthlyExpenses.length, 6);
      assert.ok(body.charts.categorySpending.length >= 2);
      assert.equal(body.recentTransactions.length, 3);
    });

    await check("wealth analytics provides data for every chart", async () => {
      const body = await expectStatus("GET", "/analytics/wealth", 200, { token });
      assert.equal(body.summary.totalSavings, 62000);
      assert.equal(body.summary.investmentValue, 125000);
      assert.equal(body.summary.netWorth, 187000);
      assert.equal(body.charts.netWorthTrend.length, 6);
      assert.equal(body.charts.monthlyActivity.length, 6);
      assert.equal(body.charts.savingsRateTrend.length, 6);
      assert.equal(body.charts.goalProgress.length, 1);
      assert.equal(body.charts.habitCompletion.length, 6);
      assert.ok(body.insights.length >= 3);
    });

    await check("standard users cannot open admin APIs", async () => {
      await expectStatus("GET", "/admin/summary", 403, { token });
    });

    await check("admin dashboard data, user list, and feedback workflow load", async () => {
      await User.findByIdAndUpdate(testUserId, { role: "admin" });
      await Feedback.create({
        userId: testUserId,
        message: "Phase 11 test feedback for the admin issue workflow.",
        status: "open"
      });

      const login = await expectStatus("POST", "/auth/login", 200, {
        body: { email: testEmail, password: testPassword }
      });
      token = login.token;

      const summary = await expectStatus("GET", "/admin/summary", 200, { token });
      assert.ok(summary.totalUsers >= 1);
      assert.ok(summary.transactionCount >= 3);
      assert.ok(summary.habitCompletionRate >= 0);

      const users = await expectStatus("GET", "/admin/users", 200, { token });
      assert.ok(users.users.some((user) => user.email === testEmail));

      const feedback = await expectStatus("GET", "/admin/feedback", 200, { token });
      const testFeedback = feedback.feedback.find((item) => item.user?.email === testEmail);
      assert.ok(testFeedback);
      feedbackId = testFeedback.id;

      const updated = await expectStatus("PATCH", `/admin/feedback/${feedbackId}`, 200, {
        token,
        body: { status: "in_review" }
      });
      assert.equal(updated.feedback.status, "in_review");

      await expectStatus("PATCH", `/admin/feedback/${feedbackId}`, 400, {
        token,
        body: { status: "not-a-status" }
      });
    });

    console.log(`\nPhase 11 validation passed: ${passedChecks} checks completed.`);
  } finally {
    await clearTestData();
  }
}

run()
  .catch((error) => {
    console.error("\nPhase 11 validation failed:", error.stack || error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await stopValidationServer();
  });
