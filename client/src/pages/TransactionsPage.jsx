import { useEffect, useMemo, useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import api from "../services/api.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import useAuth from "../hooks/useAuth.js";

const expenseCategories = [
  "Food",
  "Rent",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Education",
  "Entertainment",
  "Other"
];

const incomeCategories = ["Salary", "Freelance", "Interest", "Gift", "Other"];

const initialForm = {
  type: "expense",
  category: "Food",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  note: ""
};

function currentMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({ month: currentMonth(), type: "", category: "" });
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currency = user?.currencyPreference || "INR";

  const categories = useMemo(
    () => (formData.type === "expense" ? expenseCategories : incomeCategories),
    [formData.type]
  );

  const loadTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const response = await api.get("/transactions", { params });
      setTransactions(response.data.transactions);
      setSummary(response.data.summary);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => {
      const next = { ...current, [name]: value };

      if (name === "type") {
        next.category = value === "expense" ? "Food" : "Salary";
      }

      return next;
    });
  };

  const handleFilterChange = (event) => {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount)
      };

      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post("/transactions", payload);
      }

      resetForm();
      await loadTransactions();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not save transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: new Date(transaction.date).toISOString().slice(0, 10),
      note: transaction.note || ""
    });
  };

  const handleDelete = async (transactionId) => {
    setError("");

    try {
      await api.delete(`/transactions/${transactionId}`);
      await loadTransactions();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not delete transaction.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-sm font-semibold text-brand">Income & Expense Tracking</p>
        <h1 className="mt-1 text-3xl font-bold">Transactions</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Add income and expenses manually, filter your records, and review monthly savings performance.
        </p>
      </header>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile label="Income" value={formatCurrency(summary?.totalIncome, currency)} />
        <SummaryTile label="Expenses" value={formatCurrency(summary?.totalExpenses, currency)} />
        <SummaryTile label="Net Savings" value={formatCurrency(summary?.netSavings, currency)} />
        <SummaryTile label="Savings Rate" value={`${summary?.savingsRate || 0}%`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
          <div className="mb-4">
            <h2 className="text-lg font-bold">{editingId ? "Edit Transaction" : "Add Transaction"}</h2>
            <p className="mt-1 text-sm text-muted">Record income or spending with a category and date.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Type
              <select
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="type"
                onChange={handleFormChange}
                value={formData.type}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Category
              <select
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="category"
                onChange={handleFormChange}
                value={formData.category}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Amount
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                min="0"
                name="amount"
                onChange={handleFormChange}
                required
                type="number"
                value={formData.amount}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Date
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="date"
                onChange={handleFormChange}
                required
                type="date"
                value={formData.date}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Note
              <textarea
                className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                maxLength={300}
                name="note"
                onChange={handleFormChange}
                value={formData.note}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-blue-700 disabled:opacity-70"
              disabled={submitting}
              type="submit"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {editingId ? "Update" : "Add"}
            </button>
            {editingId ? (
              <button
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={resetForm}
                type="button"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">Transaction History</h2>
              <p className="mt-1 text-sm text-muted">Filter by month, type, and category.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="month"
                onChange={handleFilterChange}
                type="month"
                value={filters.month}
              />
              <select
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="type"
                onChange={handleFilterChange}
                value={filters.type}
              >
                <option value="">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="category"
                onChange={handleFilterChange}
                value={filters.category}
              >
                <option value="">All categories</option>
                {[...incomeCategories, ...expenseCategories].map((category, index) => (
                  <option key={`${category}-${index}`} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm font-medium text-muted">Loading transactions...</p>
          ) : transactions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-muted">
                    <th className="py-3 font-semibold">Date</th>
                    <th className="py-3 font-semibold">Type</th>
                    <th className="py-3 font-semibold">Category</th>
                    <th className="py-3 font-semibold">Note</th>
                    <th className="py-3 text-right font-semibold">Amount</th>
                    <th className="py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr className="border-b border-slate-100 last:border-0" key={transaction.id}>
                      <td className="py-3 text-muted">{formatDate(transaction.date)}</td>
                      <td className="py-3 capitalize">{transaction.type}</td>
                      <td className="py-3 font-medium">{transaction.category}</td>
                      <td className="max-w-56 truncate py-3 text-muted">{transaction.note || "-"}</td>
                      <td className="py-3 text-right font-semibold">
                        {formatCurrency(transaction.amount, currency)}
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-md border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
                            onClick={() => handleEdit(transaction)}
                            title="Edit transaction"
                            type="button"
                          >
                            <Edit2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(transaction.id)}
                            title="Delete transaction"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
              <p className="font-semibold text-slate-800">No transactions match these filters</p>
              <p className="mt-2 text-sm text-muted">Add your first income or expense record from the form.</p>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

function SummaryTile({ label, value }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </article>
  );
}
