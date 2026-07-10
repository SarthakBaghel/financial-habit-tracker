import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import connectDatabase from "../src/config/database.js";
import { Asset, Habit, HabitLog, Profile, SavingsGoal, Transaction, User } from "../src/models/index.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const demoEmail = (process.env.DEMO_EMAIL || "demo@wealthtrack.app").toLowerCase();
const demoPassword = process.env.DEMO_PASSWORD || "WealthTrackDemo123!";

async function seedDemoAccount() {
  await connectDatabase();

  const passwordHash = await bcrypt.hash(demoPassword, 12);
  const user = await User.findOneAndUpdate(
    { email: demoEmail },
    {
      name: "WealthTrack Demo",
      email: demoEmail,
      passwordHash,
      role: "user",
      currencyPreference: "INR"
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).select("+passwordHash");

  await Promise.all([
    Transaction.deleteMany({ userId: user._id }),
    HabitLog.deleteMany({ userId: user._id }),
    Habit.deleteMany({ userId: user._id }),
    SavingsGoal.deleteMany({ userId: user._id }),
    Asset.deleteMany({ userId: user._id })
  ]);

  await Profile.findOneAndUpdate(
    { userId: user._id },
    {
      monthlyIncomeTarget: 85000,
      savingsTarget: 25000,
      riskPreference: "moderate",
      financialGoals: [{ title: "Build a six-month emergency fund", targetAmount: 300000, priority: "high", status: "active" }]
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await Transaction.insertMany([
    { userId: user._id, type: "income", category: "Salary", amount: 85000, date: "2026-07-01", note: "Monthly salary" },
    { userId: user._id, type: "expense", category: "Rent", amount: 22000, date: "2026-07-02", note: "July rent" },
    { userId: user._id, type: "expense", category: "Food", amount: 6850, date: "2026-07-05", note: "Groceries and meals" },
    { userId: user._id, type: "expense", category: "Transport", amount: 3200, date: "2026-07-07", note: "Commute" },
    { userId: user._id, type: "expense", category: "Bills", amount: 4200, date: "2026-07-08", note: "Utilities" },
    { userId: user._id, type: "income", category: "Freelance", amount: 12000, date: "2026-06-15", note: "Design project" },
    { userId: user._id, type: "expense", category: "Shopping", amount: 5600, date: "2026-06-18", note: "Household essentials" }
  ]);

  const [logExpenses, saveMoney, reviewBudget] = await Habit.insertMany([
    { userId: user._id, habitName: "Log expenses", frequency: "daily", target: 1, streak: 5, status: "active" },
    { userId: user._id, habitName: "Save money today", frequency: "daily", target: 1, streak: 4, status: "active" },
    { userId: user._id, habitName: "Review budget", frequency: "weekly", target: 1, streak: 2, status: "active" }
  ]);

  await HabitLog.insertMany([
    { userId: user._id, habitId: logExpenses._id, date: "2026-07-08", completed: true },
    { userId: user._id, habitId: saveMoney._id, date: "2026-07-08", completed: true },
    { userId: user._id, habitId: reviewBudget._id, date: "2026-07-06", completed: true }
  ]);

  await SavingsGoal.insertMany([
    { userId: user._id, title: "Emergency Fund", targetAmount: 125000, currentAmount: 80000, deadline: "2026-12-31", category: "Emergency", status: "active" },
    { userId: user._id, title: "Laptop Fund", targetAmount: 70000, currentAmount: 42000, deadline: "2026-10-31", category: "Education", status: "active" }
  ]);

  await Asset.insertMany([
    { userId: user._id, name: "Emergency savings", type: "savings", value: 80000, date: "2026-07-08" },
    { userId: user._id, name: "Index fund portfolio", type: "investment", value: 145000, date: "2026-07-08" }
  ]);

  console.log(`Demo account reset: ${demoEmail}`);
  console.log(`Demo password: ${demoPassword}`);
}

seedDemoAccount()
  .catch((error) => {
    console.error("Demo seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
