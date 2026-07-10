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
import { Activity, ArrowRight, Lightbulb, PiggyBank, ReceiptText, Target, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import ChartPanel from "../components/dashboard/ChartPanel.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import GoalProgressList from "../components/dashboard/GoalProgressList.jsx";
import RecentTransactionsTable from "../components/dashboard/RecentTransactionsTable.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../services/api.js";
import { formatCurrency, formatPercent } from "../utils/formatters.js";

const categoryColors = ["#1e4d3a", "#f4c95d", "#0d5d86", "#c45f4b", "#2f7d5d", "#a5650b"];

const emptyDashboard = {
  currency: "INR",
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0,
    activeHabits: 0,
    averageGoalProgress: 0,
    currentAssetValue: 0,
    baseline: {
      monthlyIncome: 0,
      monthlyIncomeTarget: 0,
      monthlyIncomeProgress: 0,
      monthlyExpenses: 0,
      monthlySavings: 0,
      savingsTarget: 0,
      savingsProgress: 0,
      status: { label: "Set targets", tone: "neutral" }
    }
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
        tone: "coral"
      },
      {
        label: "Net Savings",
        value: formatCurrency(dashboard.summary.netSavings, currency),
        helper: `${formatPercent(dashboard.summary.savingsRate)} savings rate`,
        icon: PiggyBank,
        tone: "amber"
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
  const baseline = dashboard.summary.baseline;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-medium text-muted">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your financial rhythm"
        status={baseline.status.label}
        statusTone={baseline.status.tone}
        title={`Welcome back, ${user?.name || "there"}`}
        description="Your income, spending, savings goals, habits, and wealth growth in one calm workspace."
        actions={<>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-[#173d2e]"
            to="/dashboard/profile-setup"
          >
            Update Profile
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#e1d7c3] bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-[#f7f1e2]"
            to="/dashboard/transactions"
          >
            Add Transaction
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#e1d7c3] bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-[#f7f1e2]"
            to="/dashboard/savings-goals"
          >
            Add Goal
          </Link>
        </>}
      />

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard {...card} key={card.label} />
        ))}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Monthly insights</h2>
          <p className="mt-1 text-sm text-muted">A quick read on this month&apos;s recorded activity.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InsightCard
            icon={ReceiptText}
            title="Spending load"
            tone="coral"
          >
            {baseline.monthlyIncome
              ? `Expenses are using ${formatPercent((baseline.monthlyExpenses / baseline.monthlyIncome) * 100)} of recorded income this month.`
              : "Add income records to compare this month&apos;s expenses with your income."}
          </InsightCard>
          <InsightCard icon={Lightbulb} title="Savings target" tone="amber">
            {baseline.savingsTarget
              ? baseline.monthlySavings >= baseline.savingsTarget
                ? "Your monthly savings target is met."
                : `${formatCurrency(Math.max(0, baseline.savingsTarget - baseline.monthlySavings), currency)} more is needed to reach this month&apos;s savings target.`
              : "Set a monthly savings target in Profile Setup to track what remains."}
          </InsightCard>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-[#e8dfce] bg-white p-5 shadow-soft lg:col-span-2">
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

        <article className="rounded-lg border border-[#e8dfce] bg-white p-5 shadow-soft">
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
                    <stop offset="5%" stopColor="#1e4d3a" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#1e4d3a" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e8dfce" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency)} tickLine={false} width={88} />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Area dataKey="value" fill="url(#wealthGradient)" stroke="#1e4d3a" strokeWidth={2} type="monotone" />
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
                <CartesianGrid stroke="#e8dfce" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency)} tickLine={false} width={88} />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Bar dataKey="amount" fill="#c45f4b" radius={[6, 6, 0, 0]} />
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

function InsightCard({ children, icon: Icon, title, tone }) {
  const toneClass = {
    amber: "bg-[#fff1c7] text-amber",
    coral: "bg-[#fff1df] text-coral"
  }[tone] || "bg-[#e6f3eb] text-brand";

  return (
    <article className="rounded-lg border border-[#e8dfce] bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <span className={`rounded-md p-2 ${toneClass}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{children}</p>
        </div>
      </div>
    </article>
  );
}
