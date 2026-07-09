import asyncHandler from "../utils/asyncHandler.js";
import { getMonthRange } from "../utils/dateRanges.js";
import { EXPENSE_CATEGORIES, TRANSACTION_TYPES } from "../constants/finance.js";
import Transaction from "../models/Transaction.js";

function buildTransactionQuery(userId, query) {
  const filters = { userId };

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.month) {
    const { start, end } = getMonthRange(query.month);
    filters.date = { $gte: start, $lt: end };
  }

  return filters;
}

function validateTransactionPayload(payload, partial = false) {
  const requiredFields = ["type", "category", "amount", "date"];

  if (!partial) {
    requiredFields.forEach((field) => {
      if (payload[field] === undefined || payload[field] === "") {
        throw new Error(`${field} is required.`);
      }
    });
  }

  if (payload.type !== undefined && !TRANSACTION_TYPES.includes(payload.type)) {
    throw new Error("Transaction type must be income or expense.");
  }

  if (payload.type === "expense" && payload.category && !EXPENSE_CATEGORIES.includes(payload.category)) {
    throw new Error("Expense category is not supported.");
  }

  if (payload.amount !== undefined && Number(payload.amount) < 0) {
    throw new Error("Amount cannot be negative.");
  }
}

function mapTransaction(transaction) {
  return {
    id: transaction._id,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
    note: transaction.note,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt
  };
}

function calculateSummary(transactions) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const categoryTotals = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((totals, transaction) => {
      totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
      return totals;
    }, {});

  return {
    totalIncome,
    totalExpenses,
    netSavings: totalIncome - totalExpenses,
    savingsRate: totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0,
    transactionCount: transactions.length,
    categoryTotals
  };
}

export const listTransactions = asyncHandler(async (req, res) => {
  const filters = buildTransactionQuery(req.user._id, req.query);
  const transactions = await Transaction.find(filters).sort({ date: -1, createdAt: -1 }).lean();

  res.status(200).json({
    transactions: transactions.map(mapTransaction),
    summary: calculateSummary(transactions),
    filters: {
      month: req.query.month || "",
      category: req.query.category || "",
      type: req.query.type || ""
    },
    expenseCategories: EXPENSE_CATEGORIES
  });
});

export const createTransaction = asyncHandler(async (req, res) => {
  try {
    validateTransactionPayload(req.body);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const transaction = await Transaction.create({
    userId: req.user._id,
    type: req.body.type,
    category: req.body.category,
    amount: Number(req.body.amount),
    date: req.body.date,
    note: req.body.note || ""
  });

  res.status(201).json({ transaction: mapTransaction(transaction) });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  try {
    validateTransactionPayload(req.body, true);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found.");
  }

  res.status(200).json({ transaction: mapTransaction(transaction) });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found.");
  }

  res.status(200).json({ message: "Transaction deleted." });
});

export const getTransactionSummary = asyncHandler(async (req, res) => {
  const filters = buildTransactionQuery(req.user._id, req.query);
  const transactions = await Transaction.find(filters).lean();

  res.status(200).json({
    summary: calculateSummary(transactions)
  });
});
