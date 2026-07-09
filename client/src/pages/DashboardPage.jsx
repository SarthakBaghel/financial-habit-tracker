import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Activity, ArrowRight, PiggyBank, Target, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import ChartPanel from "../components/dashboard/ChartPanel.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import GoalProgressList from "../components/dashboard/GoalProgressList.jsx";
import RecentTransactionsTable from "../components/dashboard/RecentTransactionsTable.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../services/api.js";
import { formatCurrency, formatPercent } from "../utils/formatters.js";

const categoryColors = ["#2563eb", "#0f766e", "#b45309", "#7c3aed", "#dc2626", "#0891b2"];

const emptyDashboard = {
  currency: "INR",
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0,
    activeHabits: 0,
    averageGoalProgress: 0,
    currentAssetValue: 0
  },
  charts: {
    wealthTrend: [],
    monthlyExpenses: [],
    categorySpending: []
  },
  goals: [],
  recentTransactions: []
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard/overview");

        if (isMounted) {
          setDashboard(response.data);
          setError("");
        }
      } catch (apiError) {
        if (isMounted) {
          setError(apiError.response?.data?.message || "Could not load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const currency = dashboard.currency || user?.currencyPreference || "INR";
  const summaryCards = useMemo(
    () => [
      {
        label: "Total Income",
        value: formatCurrency(dashboard.summary.totalIncome, currency),
        helper: "All income recorded so far",
        icon: TrendingUp,
        tone: "mint"
      },
      {
        label: "Total Expenses",
        value: formatCurrency(dashboard.summary.totalExpenses, currency),
        helper: "Manual expenses tracked",
        icon: TrendingDown,
        tone: "amber"
      },
      {
        label: "Net Savings",
        value: formatCurrency(dashboard.summary.netSavings, currency),
        helper: `${formatPercent(dashboard.summary.savingsRate)} savings rate`,
        icon: PiggyBank,
        tone: "brand"
      },
      {
        label: "Active Habits",
        value: dashboard.summary.activeHabits,
        helper: `${formatPercent(dashboard.summary.averageGoalProgress)} average goal progress`,
        icon: Target,
        tone: "slate"
      }
    ],
    [currency, dashboard.summary]
  );

  const hasWealthTrend = dashboard.charts.wealthTrend.some((point) => point.value > 0);
  const hasMonthlyExpenses = dashboard.charts.monthlyExpenses.some((point) => point.amount > 0);
  const hasCategorySpending = dashboard.charts.categorySpending.length > 0;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-medium text-muted">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand">Mint-style overview</p>
          <h2 className="mt-1 text-3xl font-bold tracking-normal">Welcome, {user?.name}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Your income, spending, savings goals, habits, and wealth growth in one working dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-blue-700"
            to="/profile-setup"
          >
            Update Profile
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
            to="/transactions"
          >
            Add Transaction
          </Link>
        </div>
      </header>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard {...card} key={card.label} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Current Wealth Position</h3>
              <p className="mt-1 text-sm text-muted">Latest manual asset value plus net savings.</p>
            </div>
            <WalletCards className="h-5 w-5 text-mint" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold">
            {formatCurrency(dashboard.summary.currentAssetValue + dashboard.summary.netSavings, currency)}
          </p>
          <p className="mt-2 text-sm text-muted">
            Assets: {formatCurrency(dashboard.summary.currentAssetValue, currency)} - Savings:{" "}
            {formatCurrency(dashboard.summary.netSavings, currency)}
          </p>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Spending Load</h3>
              <p className="mt-1 text-sm text-muted">Expenses compared with income.</p>
            </div>
            <Activity className="h-5 w-5 text-amber" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold">
            {formatPercent(
              dashboard.summary.totalIncome
                ? (dashboard.summary.totalExpenses / dashboard.summary.totalIncome) * 100
                : 0
            )}
          </p>
          <p className="mt-2 text-sm text-muted">Lower is better for long-term wealth growth.</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartPanel description="Six-month trend from monthly net savings and asset entries." title="Wealth Growth Trend">
          {hasWealthTrend ? (
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={dashboard.charts.wealthTrend}>
                <defs>
                  <linearGradient id="wealthGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency)} tickLine={false} width={88} />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Area dataKey="value" fill="url(#wealthGradient)" stroke="#2563eb" strokeWidth={2} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              message="Add assets or income and expense records to see your growth curve."
              title="No wealth trend yet"
            />
          )}
        </ChartPanel>

        <ChartPanel description="Expense totals by month across the latest six-month window." title="Monthly Expenses">
          {hasMonthlyExpenses ? (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={dashboard.charts.monthlyExpenses}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency)} tickLine={false} width={88} />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Bar dataKey="amount" fill="#b45309" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Expense categories will populate once transactions are added." title="No expenses yet" />
          )}
        </ChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartPanel description="Where your recorded expenses are going." title="Category-Wise Spending">
          {hasCategorySpending ? (
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={dashboard.charts.categorySpending}
                  dataKey="amount"
                  innerRadius={58}
                  nameKey="category"
                  outerRadius={96}
                  paddingAngle={3}
                >
                  {dashboard.charts.categorySpending.map((entry, index) => (
                    <Cell fill={categoryColors[index % categoryColors.length]} key={entry.category} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Category spending appears after expense entries exist." title="No category data yet" />
          )}
        </ChartPanel>

        <GoalProgressList currency={currency} goals={dashboard.goals} />
      </section>

      <RecentTransactionsTable currency={currency} transactions={dashboard.recentTransactions} />
    </div>
  );
}
