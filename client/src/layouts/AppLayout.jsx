import { BarChart3, CircleDollarSign, Home, LogOut, Target, UserCog, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const navigation = [
  { label: "Dashboard", icon: Home, to: "/" },
  { label: "Profile Setup", icon: UserRound, to: "/profile-setup" },
  { label: "Expenses", icon: CircleDollarSign, to: "/transactions" },
  { label: "Habits", icon: Target, to: "/habits" },
  { label: "Analytics", icon: BarChart3, to: "/" },
  { label: "Admin", icon: UserCog, to: "/admin", adminOnly: true }
];

export default function AppLayout({ children }) {
  const { logout, user } = useAuth();
  const visibleNavigation = navigation.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <div className="min-h-screen bg-surface text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <div className="mb-8 px-2">
          <p className="text-sm font-semibold text-brand">WealthTrack</p>
          <h1 className="mt-1 text-xl font-bold leading-tight">Financial Habit Builder</h1>
          <p className="mt-3 text-sm text-muted">{user?.name}</p>
        </div>
        <nav className="space-y-1">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium ${
                    isActive ? "bg-blue-50 text-brand" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
                key={item.label}
                to={item.to}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <button
          className="absolute bottom-5 left-4 right-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          onClick={logout}
          type="button"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
