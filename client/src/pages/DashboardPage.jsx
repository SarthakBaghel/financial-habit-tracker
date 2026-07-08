import { Activity, PiggyBank, ShieldCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import api from "../services/api.js";

const cards = [
  {
    label: "Monthly Income",
    value: "₹86,000",
    helper: "Sample seed target",
    icon: TrendingUp
  },
  {
    label: "Expenses",
    value: "₹42,750",
    helper: "Manual tracking planned",
    icon: Activity
  },
  {
    label: "Savings Rate",
    value: "31%",
    helper: "Goal-based budgeting",
    icon: PiggyBank
  },
  {
    label: "Habit Streak",
    value: "8 days",
    helper: "YNAB-style discipline",
    icon: ShieldCheck
  }
];

export default function DashboardPage() {
  const { profile, user } = useAuth();

  const checkApi = async () => {
    const response = await api.get("/health");
    window.alert(response.data.message);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand">Phase 1 foundation</p>
          <h2 className="mt-1 text-3xl font-bold tracking-normal">Welcome, {user?.name}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Mint-style financial visibility with YNAB-style habit building, ready for real modules in the next phases.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
            to="/profile-setup"
          >
            Profile Setup
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-blue-700"
            onClick={checkApi}
            type="button"
          >
            Check API
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" key={card.label}>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-muted">{card.label}</p>
                <Icon className="h-5 w-5 text-mint" aria-hidden="true" />
              </div>
              <p className="mt-4 text-2xl font-bold">{card.value}</p>
              <p className="mt-1 text-sm text-muted">{card.helper}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold">Financial profile</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted">Currency</dt>
            <dd className="mt-1 font-semibold">{user?.currencyPreference}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Income target</dt>
            <dd className="mt-1 font-semibold">₹{Number(profile?.monthlyIncomeTarget || 0).toLocaleString("en-IN")}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Savings target</dt>
            <dd className="mt-1 font-semibold">₹{Number(profile?.savingsTarget || 0).toLocaleString("en-IN")}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
