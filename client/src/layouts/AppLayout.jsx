import { BarChart3, CircleDollarSign, Home, Target, UserCog } from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: Home },
  { label: "Expenses", icon: CircleDollarSign },
  { label: "Habits", icon: Target },
  { label: "Analytics", icon: BarChart3 },
  { label: "Admin", icon: UserCog }
];

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <div className="mb-8 px-2">
          <p className="text-sm font-semibold text-brand">WealthTrack</p>
          <h1 className="mt-1 text-xl font-bold leading-tight">Financial Habit Builder</h1>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                key={item.label}
                type="button"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
