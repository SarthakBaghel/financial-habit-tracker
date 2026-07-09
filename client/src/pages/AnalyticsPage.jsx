import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { BarChart3, Edit2, Lightbulb, Plus, Trash2, TrendingUp, WalletCards } from "lucide-react";
import ChartPanel from "../components/dashboard/ChartPanel.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import api from "../services/api.js";
import { formatCurrency, formatDate, formatPercent } from "../utils/formatters.js";

const initialAssetForm = {
  name: "",
  type: "savings",
  value: "",
  date: new Date().toISOString().slice(0, 10)
};

const emptyAnalytics = {
  currency: "INR",
  summary: {
    totalSavings: 0,
    totalSavingsAssets: 0,
    investmentValue: 0,
    otherAssetValue: 0,
    totalAssetValue: 0,
    netWorth: 0,
    savingsRate: 0,
    totalIncome: 0,
    totalExpenses: 0,
    activeHabits: 0,
    habitCompletionRate: 0,
    averageGoalProgress: 0
  },
  charts: {
    netWorthTrend: [],
    monthlyActivity: [],
    savingsRateTrend: [],
    goalProgress: [],
    habitCompletion: []
  },
  assets: [],
  insights: []
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [assetForm, setAssetForm] = useState(initialAssetForm);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currency = analytics.currency || "INR";

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/analytics/wealth");
      setAnalytics(response.data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load wealth analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const summaryCards = useMemo(
    () => [
      {
        label: "Net Worth",
        value: formatCurrency(analytics.summary.netWorth, currency),
        helper: "Tracked assets plus net savings",
        icon: WalletCards,
        tone: "brand"
      },
      {
        label: "Total Savings",
        value: formatCurrency(analytics.summary.totalSavings, currency),
        helper: `${formatPercent(analytics.summary.savingsRate)} lifetime savings rate`,
        icon: TrendingUp,
        tone: "mint"
      },
      {
        label: "Investments",
        value: formatCurrency(analytics.summary.investmentValue, currency),
        helper: "Latest manual investment values",
        icon: BarChart3,
        tone: "slate"
      },
      {
        label: "Habit Completion",
        value: formatPercent(analytics.summary.habitCompletionRate),
        helper: `${analytics.summary.activeHabits} active habits`,
        icon: Lightbulb,
        tone: "amber"
      }
    ],
    [analytics.summary, currency]
  );

  const hasNetWorthTrend = analytics.charts.netWorthTrend.some((point) => point.netWorth > 0);
  const hasMonthlyActivity = analytics.charts.monthlyActivity.some((point) => point.income > 0 || point.expenses > 0);
  const hasSavingsRateTrend = analytics.charts.savingsRateTrend.some((point) => point.savingsRate !== 0);
  const hasGoalProgress = analytics.charts.goalProgress.length > 0;
  const hasHabitCompletion = analytics.charts.habitCompletion.some((point) => point.total > 0);

  const handleAssetChange = (event) => {
    setAssetForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const resetAssetForm = () => {
    setEditingAssetId(null);
    setAssetForm(initialAssetForm);
  };

  const handleAssetSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...assetForm,
      value: Number(assetForm.value)
    };

    try {
      if (editingAssetId) {
        await api.put(`/assets/${editingAssetId}`, payload);
      } else {
        await api.post("/assets", payload);
      }

      resetAssetForm();
      await loadAnalytics();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not save asset entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const editAsset = (asset) => {
    setEditingAssetId(asset.id);
    setAssetForm({
      name: asset.name,
      type: asset.type,
      value: asset.value,
      date: new Date(asset.date).toISOString().slice(0, 10)
    });
  };

  const deleteAsset = async (assetId) => {
    setError("");

    try {
      await api.delete(`/assets/${assetId}`);
      await loadAnalytics();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not delete asset entry.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-medium text-muted">
        Loading wealth analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-sm font-semibold text-brand">Wealth Growth & Analytics</p>
        <h1 className="mt-1 text-3xl font-bold">Wealth Analytics</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Track assets manually, monitor net worth, compare income against expenses, and review habit and goal progress.
        </p>
      </header>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard {...card} key={card.label} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" onSubmit={handleAssetSubmit}>
            <div className="mb-4">
              <h2 className="text-lg font-bold">{editingAssetId ? "Edit Asset Entry" : "Add Asset Entry"}</h2>
              <p className="mt-1 text-sm text-muted">Record savings, investments, or asset values manually.</p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  name="name"
                  onChange={handleAssetChange}
                  placeholder="Mutual fund portfolio"
                  required
                  type="text"
                  value={assetForm.name}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Type
                <select
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  name="type"
                  onChange={handleAssetChange}
                  value={assetForm.type}
                >
                  <option value="savings">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="asset">Asset</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Value
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  min="0"
                  name="value"
                  onChange={handleAssetChange}
                  required
                  type="number"
                  value={assetForm.value}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Valuation date
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  name="date"
                  onChange={handleAssetChange}
                  required
                  type="date"
                  value={assetForm.date}
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
                {editingAssetId ? "Update Asset" : "Add Asset"}
              </button>
              {editingAssetId ? (
                <button
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={resetAssetForm}
                  type="button"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-bold">Simple Insights</h2>
            <div className="mt-4 space-y-3">
              {analytics.insights.map((insight) => (
                <p className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700" key={insight}>
                  {insight}
                </p>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5">
            <h2 className="text-lg font-bold">Tracked Assets</h2>
            <p className="mt-1 text-sm text-muted">Latest values used for asset and net worth calculations.</p>
          </div>

          {analytics.assets.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-muted">
                    <th className="py-3 font-semibold">Name</th>
                    <th className="py-3 font-semibold">Type</th>
                    <th className="py-3 font-semibold">Date</th>
                    <th className="py-3 text-right font-semibold">Value</th>
                    <th className="py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.assets.map((asset) => (
                    <tr className="border-b border-slate-100 last:border-0" key={asset.id}>
                      <td className="py-3 font-medium">{asset.name}</td>
                      <td className="py-3 capitalize text-muted">{asset.type}</td>
                      <td className="py-3 text-muted">{formatDate(asset.date)}</td>
                      <td className="py-3 text-right font-semibold">{formatCurrency(asset.value, currency)}</td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-md border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
                            onClick={() => editAsset(asset)}
                            title="Edit asset"
                            type="button"
                          >
                            <Edit2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                            onClick={() => deleteAsset(asset.id)}
                            title="Delete asset"
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
              <p className="font-semibold text-slate-800">No assets tracked yet</p>
              <p className="mt-2 text-sm text-muted">Add savings, investments, or assets from the form.</p>
            </div>
          )}
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartPanel description="Six-month trend from manual asset entries and net savings." title="Net Worth Trend">
          {hasNetWorthTrend ? (
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={analytics.charts.netWorthTrend}>
                <defs>
                  <linearGradient id="netWorthGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency)} tickLine={false} width={88} />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Area dataKey="netWorth" fill="url(#netWorthGradient)" stroke="#2563eb" strokeWidth={2} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Add transactions and assets to see net worth over time." title="No net worth trend yet" />
          )}
        </ChartPanel>

        <ChartPanel description="Monthly cash-flow comparison from transaction records." title="Income vs Expense">
          {hasMonthlyActivity ? (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={analytics.charts.monthlyActivity}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency)} tickLine={false} width={88} />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Bar dataKey="income" fill="#0f766e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="#b45309" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Add income and expense records to compare monthly activity." title="No activity yet" />
          )}
        </ChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartPanel description="Monthly savings rate from income and expense records." title="Savings Rate">
          {hasSavingsRateTrend ? (
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={analytics.charts.savingsRateTrend}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} width={48} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line dataKey="savingsRate" dot={{ r: 4 }} stroke="#2563eb" strokeWidth={2} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Savings rate appears after monthly income and expenses exist." title="No rate yet" />
          )}
        </ChartPanel>

        <ChartPanel description="Savings goal completion by goal." title="Savings Goal Progress">
          {hasGoalProgress ? (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={analytics.charts.goalProgress} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} type="number" />
                <YAxis dataKey="title" tickLine={false} type="category" width={96} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="progress" fill="#0f766e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Create savings goals to compare progress." title="No goals yet" />
          )}
        </ChartPanel>

        <ChartPanel description="Habit completion rate by month." title="Habit Completion">
          {hasHabitCompletion ? (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={analytics.charts.habitCompletion}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tickLine={false} width={48} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="completionRate" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Mark habits complete to see monthly consistency." title="No habit logs yet" />
          )}
        </ChartPanel>
      </section>
    </div>
  );
}
