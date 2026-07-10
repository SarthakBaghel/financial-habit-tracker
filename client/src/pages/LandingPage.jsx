import { ArrowRight, BarChart3, Check, Menu, ShieldCheck, Target, TrendingUp, WalletCards, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#habits" },
  { label: "Dashboard", href: "#dashboard-preview" },
  { label: "Goals", href: "#goals" }
];

const featureCards = [
  ["Track every rupee with clarity", "Add income and expenses in a few taps, then see exactly where your money is going.", WalletCards, "bg-[#e6f3eb] text-[#1e4d3a]"],
  ["Make financial habits stick", "Turn small actions like logging expenses and saving today into visible streaks.", Check, "bg-[#fff1c7] text-[#9a6700]"],
  ["See long-term progress", "Connect daily choices to savings goals, net worth, and financial growth over time.", BarChart3, "bg-[#e6f1f8] text-[#0d5d86]"]
];

const habits = [
  ["Save money today", "12 day streak", true],
  ["Log expenses", "8 day streak", true],
  ["Review budget", "Due this week", false],
  ["Invest monthly", "Completed", true]
];

const goals = [
  ["Emergency fund", "₹ 80,000", "₹ 1,25,000", "64%", "w-[64%]", "bg-[#1e4d3a]", "On track"],
  ["Laptop fund", "₹ 42,000", "₹ 70,000", "60%", "w-[60%]", "bg-[#0d5d86]", "On track"],
  ["Vacation fund", "₹ 18,000", "₹ 50,000", "36%", "w-[36%]", "bg-[#e8795b]", "Behind"]
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const primaryPath = isAuthenticated ? "/dashboard" : "/register";
  const primaryLabel = isAuthenticated ? "Continue to dashboard" : "Start tracking";
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fffdf8] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-[#fffdf8]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8" aria-label="Landing navigation">
          <Link className="flex items-center gap-2 font-bold text-slate-950" to="/">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-[#1e4d3a] text-sm font-extrabold text-white">W</span>
            <span>WealthTrack</span>
          </Link>
          <div className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => <a className="text-sm font-medium text-slate-600 transition hover:text-slate-950" href={item.href} key={item.label}>{item.label}</a>)}
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            {!isAuthenticated ? <Link className="text-sm font-semibold text-slate-700 hover:text-slate-950" to="/login">Log in</Link> : null}
            <Link className="rounded-md bg-[#1e4d3a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173d2e]" to={primaryPath}>{primaryLabel}</Link>
          </div>
          <button aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} className="rounded-md border border-slate-300 p-2 text-slate-700 sm:hidden" onClick={() => setMenuOpen((open) => !open)} type="button">
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </nav>
        {menuOpen ? <div className="border-t border-slate-200 bg-[#fffdf8] px-4 py-4 sm:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1">{navItems.map((item) => <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white" href={item.href} key={item.label} onClick={closeMenu}>{item.label}</a>)}{!isAuthenticated ? <Link className="mt-2 rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700" onClick={closeMenu} to="/login">Log in</Link> : null}<Link className="rounded-md bg-[#1e4d3a] px-3 py-2 text-center text-sm font-semibold text-white" onClick={closeMenu} to={primaryPath}>{primaryLabel}</Link></div></div> : null}
      </header>

      <section className="border-b border-slate-200 bg-[#fffdf8]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#e6f3eb] px-3 py-1.5 text-xs font-bold text-[#1e4d3a]"><ShieldCheck className="h-4 w-4" aria-hidden="true" />A calmer way to manage your money</p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] text-slate-950 sm:text-5xl lg:text-6xl">Build better money habits. <span className="text-[#1e4d3a]">Grow your wealth.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{isAuthenticated ? "Welcome back. Your latest financial progress is ready when you are." : "Track income, expenses, habits, savings goals, and net worth in one calm financial dashboard."}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1e4d3a] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#173d2e]" to={primaryPath}>{primaryLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>{!isAuthenticated ? <a className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400" href="#features">Explore features<BarChart3 className="h-4 w-4" aria-hidden="true" /></a> : null}</div>
            <p className="mt-4 text-sm text-slate-500">Manual tracking. INR-first. No bank connection required.</p>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-5" aria-label="WealthTrack highlights"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-4 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:px-8">{["6+ core modules", "INR-first tracking", "Habit streaks", "Savings goals", "Wealth analytics"].map((stat) => <p className="border-slate-200 px-4 text-center text-sm font-bold text-slate-700 last:border-0 lg:border-r" key={stat}>{stat}</p>)}</div></section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="features">
        <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wide text-[#1e4d3a]">Why it works</p><h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">A calmer way to build financial discipline.</h2><p className="mt-4 text-base leading-7 text-slate-600">See where your money goes, what habits stick, and how your wealth grows. No bank connection required.</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">{featureCards.map(([title, description, Icon, color]) => <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" key={title}><span className={`grid h-11 w-11 place-items-center rounded-md ${color}`}><Icon className="h-5 w-5" aria-hidden="true" /></span><h3 className="mt-6 text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p></article>)}</div>
      </section>

      <DashboardPreview />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8" id="habits">
        <div><p className="text-sm font-bold uppercase tracking-wide text-[#b45309]">Beyond budgeting</p><h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">Money progress is built one repeatable action at a time.</h2><p className="mt-4 text-base leading-7 text-slate-600">Create routines that support your financial goals, mark them done, and let a visible streak keep the momentum alive.</p></div>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6"><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><p className="text-sm font-bold text-slate-950">This week&apos;s financial habits</p><p className="mt-1 text-sm text-slate-500">3 of 4 completed</p></div><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#b45309]">12 day streak</span></div><div className="mt-3 divide-y divide-slate-100">{habits.map(([label, detail, complete]) => <div className="flex items-center justify-between gap-4 py-4" key={label}><div className="flex items-center gap-3"><span className={`grid h-6 w-6 place-items-center rounded-full border ${complete ? "border-[#1e4d3a] bg-[#1e4d3a] text-white" : "border-slate-300 text-transparent"}`}><Check className="h-4 w-4" aria-hidden="true" /></span><div><p className="text-sm font-semibold text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div></div><span className={`h-2 w-2 rounded-full ${complete ? "bg-[#1e4d3a]" : "bg-[#f4c95d]"}`} /></div>)}</div></article>
      </section>

      <section className="bg-[#f7f1e2] py-20" id="goals"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wide text-[#1e4d3a]">Savings goals</p><h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">Give every goal a visible next step.</h2></div><p className="max-w-md text-sm leading-6 text-slate-600">Know how much you&apos;ve saved, what remains, and whether your pace is where it needs to be.</p></div><div className="mt-10 grid gap-4 md:grid-cols-3">{goals.map(([title, saved, target, progress, width, color, status]) => <article className="rounded-lg border border-[#e8dcc1] bg-white p-5 shadow-sm" key={title}><div className="flex justify-between gap-3"><h3 className="font-bold text-slate-950">{title}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status === "On track" ? "bg-emerald-50 text-[#1e4d3a]" : "bg-orange-50 text-[#b45309]"}`}>{status}</span></div><p className="mt-7 text-2xl font-bold text-slate-950">{saved}</p><p className="mt-1 text-sm text-slate-500">of {target}</p><div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${width} ${color}`} /></div><div className="mt-3 flex justify-between text-xs font-semibold text-slate-500"><span>{progress} complete</span><span>View details</span></div></article>)}</div></div></section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8"><AnalyticsPreview /><div><p className="text-sm font-bold uppercase tracking-wide text-[#0d5d86]">Wealth analytics</p><h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">Understand the direction, not just the balance.</h2><p className="mt-4 text-base leading-7 text-slate-600">Follow your net-worth trend, savings rate, income versus expense activity, and goal progress from one analytics workspace.</p><div className="mt-6 flex items-center gap-3 text-sm font-bold text-[#1e4d3a]"><span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-50"><TrendingUp className="h-5 w-5" aria-hidden="true" /></span>Small improvements become visible progress.</div></div></section>

      <section className="bg-[#e6f3eb] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><p className="text-sm font-bold uppercase tracking-wide text-[#1e4d3a]">Start with today</p><h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">Your money habits become your money future.</h2><p className="mt-4 text-base leading-7 text-slate-600">{isAuthenticated ? "Your dashboard is ready for the next financial action." : "Start tracking the choices that make your goals possible."}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1e4d3a] px-5 py-3 text-sm font-bold text-white hover:bg-[#173d2e]" to={primaryPath}>{primaryLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>{!isAuthenticated ? <Link className="inline-flex items-center justify-center rounded-md border border-[#1e4d3a] px-5 py-3 text-sm font-bold text-[#1e4d3a] hover:bg-white/60" to="/login">Log in</Link> : null}</div></div></section>

      <footer className="bg-slate-950 py-12 text-slate-300"><div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8"><div><Link className="flex items-center gap-2 text-lg font-bold text-white" to="/"><span className="grid h-8 w-8 place-items-center rounded-md bg-[#f4c95d] text-sm font-extrabold text-slate-950">W</span>WealthTrack</Link><p className="mt-4 max-w-md text-sm leading-6 text-slate-400">A financial habit and wealth growth tracker for clearer spending, stronger routines, and progress you can see.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold"><Link className="hover:text-white" to={isAuthenticated ? "/dashboard" : "/login"}>Dashboard</Link><a className="hover:text-white" href="#features">Features</a><a className="hover:text-white" href="#goals">Goals</a>{!isAuthenticated ? <Link className="hover:text-white" to="/login">Log in</Link> : null}</div></div><div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-xs text-slate-500 sm:px-6 lg:px-8">Built as a financial habit builder and wealth growth tracker.</div></footer>
    </main>
  );
}

function HeroPreview() {
  const cards = [["This month", "₹ 84,500", "text-[#1e4d3a]"], ["Savings rate", "31%", "text-[#0d5d86]"], ["Habit streak", "12 days", "text-[#b45309]"]];
  return <div className="relative mx-auto w-full max-w-xl lg:max-w-none"><div className="absolute -right-3 -top-3 h-24 w-24 rounded-md bg-[#f4c95d]" aria-hidden="true" /><div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:p-5"><div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your financial overview</p><p className="mt-1 text-lg font-bold text-slate-900">Good morning, Sarthak</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#1e4d3a]">On track</span></div><div className="grid gap-3 sm:grid-cols-3">{cards.map(([label, value, color]) => <article className="rounded-md border border-slate-100 bg-slate-50 p-3" key={label}><p className="text-xs font-medium text-slate-500">{label}</p><p className={`mt-4 text-xl font-bold ${color}`}>{value}</p><p className="mt-1 text-[11px] font-medium text-slate-500">Progress this month</p></article>)}</div><div className="mt-4 grid gap-4 rounded-md border border-slate-100 p-4 sm:grid-cols-[1.35fr_0.9fr]"><div><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-slate-900">Wealth growth</p><p className="text-xs text-slate-500">Last 6 months</p></div><TrendingUp className="h-4 w-4 text-[#1e4d3a]" aria-hidden="true" /></div><div className="mt-4 flex h-20 items-end gap-2">{[35,43,39,55,62,76].map((height, index) => <div className="flex h-full flex-1 flex-col justify-end" key={height}><div className={`rounded-sm ${index === 5 ? "bg-[#1e4d3a]" : "bg-[#b9dcc9]"}`} style={{ height: `${height}%` }} /></div>)}</div></div><div className="border-t border-slate-100 pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0"><p className="text-sm font-bold text-slate-900">Emergency fund</p><p className="mt-3 text-2xl font-bold text-slate-950">₹ 80,000</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[64%] rounded-full bg-[#f4c95d]" /></div><p className="mt-2 text-xs font-medium text-slate-500">64% of ₹ 1,25,000 goal</p></div></div></div></div>;
}

function DashboardPreview() {
  const transactions = [["Monthly salary", "Income", "+₹ 85,000", "text-[#1e4d3a]"], ["House rent", "Housing", "-₹ 22,000", "text-[#c2413b]"], ["Grocery run", "Food", "-₹ 2,850", "text-[#c2413b]"]];
  return <section className="bg-[#173d2e] py-20 text-white" id="dashboard-preview"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wide text-[#f4c95d]">Dashboard preview</p><h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">One view for your money, habits, and progress.</h2><p className="mt-4 text-base leading-7 text-emerald-50/80">Get a clean snapshot of your finances without turning budgeting into a chore.</p></div><div className="mt-10 overflow-hidden rounded-lg border border-white/15 bg-[#fffdf8] p-3 text-slate-900 shadow-2xl sm:p-5"><div className="grid gap-3 sm:grid-cols-4">{[["Income","₹ 85,000","bg-emerald-50 text-[#1e4d3a]"],["Expenses","₹ 34,250","bg-rose-50 text-[#c2413b]"],["Net savings","₹ 50,750","bg-sky-50 text-[#0d5d86]"],["Active habits","4 of 5","bg-amber-50 text-[#9a6700]"]].map(([label,value,tone]) => <div className={`rounded-md p-4 ${tone}`} key={label}><p className="text-xs font-semibold">{label}</p><p className="mt-2 text-xl font-bold text-slate-950">{value}</p></div>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><div className="rounded-md border border-slate-200 p-4"><div className="flex items-center justify-between"><div><p className="font-bold">Wealth growth</p><p className="mt-1 text-xs text-slate-500">Last 6 months</p></div><p className="text-sm font-bold text-[#1e4d3a]">+₹ 1.2L</p></div><svg className="mt-5 h-40 w-full" viewBox="0 0 600 180" role="img" aria-label="Line chart showing steadily increasing wealth"><path d="M0 152 L92 136 L180 144 L272 108 L362 120 L450 72 L600 34 L600 180 L0 180 Z" fill="#e6f3eb" /><path d="M0 152 L92 136 L180 144 L272 108 L362 120 L450 72 L600 34" fill="none" stroke="#1e4d3a" strokeLinecap="round" strokeWidth="5" /></svg></div><div className="rounded-md border border-slate-200 p-4"><p className="font-bold">Spending by category</p><div className="mt-5 space-y-4">{[["Housing","44%","w-[44%]","bg-[#1e4d3a]"],["Food","22%","w-[22%]","bg-[#f4c95d]"],["Transport","16%","w-[16%]","bg-[#0d5d86]"],["Other","18%","w-[18%]","bg-[#e8795b]"]].map(([label,value,width,color]) => <div key={label}><div className="flex justify-between text-xs font-semibold"><span>{label}</span><span>{value}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${width} ${color}`} /></div></div>)}</div></div></div><div className="mt-4 rounded-md border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-bold">Recent activity</p><p className="text-xs font-semibold text-[#1e4d3a]">View all</p></div><div className="mt-3 divide-y divide-slate-100">{transactions.map(([title,category,value,color]) => <div className="flex items-center justify-between py-3 text-sm" key={title}><div><p className="font-semibold">{title}</p><p className="mt-1 text-xs text-slate-500">{category}</p></div><p className={`font-bold ${color}`}>{value}</p></div>)}</div></div></div></div></section>;
}

function AnalyticsPreview() {
  return <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-slate-950">Financial activity</p><p className="mt-1 text-xs text-slate-500">Income vs. expenses, monthly</p></div><BarChart3 className="h-5 w-5 text-[#0d5d86]" aria-hidden="true" /></div><div className="mt-7 flex h-44 items-end justify-between gap-3 border-b border-slate-200 px-2">{[["42%","28%"],["54%","35%"],["48%","31%"],["65%","40%"],["58%","32%"],["74%","39%"]].map(([income, expense], index) => <div className="flex h-full flex-1 items-end justify-center gap-1.5" key={index}><div className="w-1/2 rounded-t-sm bg-[#1e4d3a]" style={{ height: income }} /><div className="w-1/2 rounded-t-sm bg-[#f4c95d]" style={{ height: expense }} /></div>)}</div><div className="mt-3 flex justify-end gap-4 text-xs font-semibold text-slate-500"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#1e4d3a]" />Income</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#f4c95d]" />Expenses</span></div></div>;
}
