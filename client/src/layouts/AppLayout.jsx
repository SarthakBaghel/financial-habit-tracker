import { useState } from "react";
import { BarChart3, CircleDollarSign, Home, LogOut, Menu, PiggyBank, Target, UserCog, UserRound, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const navigation = [
  { label: "Dashboard", icon: Home, to: "/dashboard" },
  { label: "Profile Setup", icon: UserRound, to: "/dashboard/profile-setup" },
  { label: "Expenses", icon: CircleDollarSign, to: "/dashboard/transactions" },
  { label: "Habits", icon: Target, to: "/dashboard/habits" },
  { label: "Savings Goals", icon: PiggyBank, to: "/dashboard/savings-goals" },
  { label: "Analytics", icon: BarChart3, to: "/dashboard/analytics" },
  { label: "Admin", icon: UserCog, to: "/dashboard/admin", adminOnly: true }
];

export default function AppLayout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNavigation = navigation.filter((item) => !item.adminOnly || user?.role === "admin");
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface text-ink">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand">WealthTrack</p>
            <p className="text-xs text-muted">{user?.name}</p>
          </div>
          <button
            className="rounded-md border border-slate-200 p-2 text-slate-700"
            onClick={() => setMobileOpen((open) => !open)}
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:w-64 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:flex`}
      >
        <div className="mb-8 flex items-start justify-between gap-4 px-2">
          <div>
            <p className="text-sm font-semibold text-brand">WealthTrack</p>
            <h1 className="mt-1 text-xl font-bold leading-tight">Financial Habit Builder</h1>
            <p className="mt-3 text-sm text-muted">{user?.name}</p>
          </div>
          <button
            className="rounded-md border border-slate-200 p-2 text-slate-700 lg:hidden"
            onClick={() => setMobileOpen(false)}
            type="button"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Primary navigation">
          {visibleNavigation.map((item) => (
            <NavigationLink item={item} key={item.label} onNavigate={() => setMobileOpen(false)} />
          ))}
        </nav>
        <button
          className="mt-5 flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          onClick={handleLogout}
          type="button"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </aside>
      <main className="lg:pl-64" id="main-content" tabIndex="-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

function NavigationLink({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium ${
          isActive ? "bg-blue-50 text-brand" : "text-slate-700 hover:bg-slate-100"
        }`
      }
      onClick={onNavigate}
      to={item.to}
      end={item.to === "/dashboard"}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}
