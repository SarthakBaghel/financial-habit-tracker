import { ArrowRight, BarChart3, CheckCircle2, LockKeyhole, Menu, PiggyBank, Target, WalletCards, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useAuth from "../hooks/useAuth.js";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  [WalletCards, "Track income and expenses", "Log the transactions that matter and review your monthly totals."],
  [CheckCircle2, "Keep habits visible", "Build a simple routine around actions such as logging expenses or reviewing your budget."],
  [BarChart3, "Follow goals and growth", "See savings goals and manual asset values alongside your day-to-day finances."]
];

const primaryButtonClass = "inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#173d2e] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const featureSectionRef = useRef(null);
  const primaryPath = isAuthenticated ? "/dashboard" : "/register";
  const primaryLabel = isAuthenticated ? "Continue to dashboard" : "Create account";

  useEffect(() => {
    const section = featureSectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const context = gsap.context(() => {
      gsap.from("[data-feature]", {
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true
        }
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-ink">
      <header className="sticky top-0 z-40 border-b border-[#e8dfce] bg-[#fffdf8]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8" aria-label="Landing navigation">
          <Link className="flex items-center gap-2 text-base font-bold" to="/">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-xs font-extrabold text-white">W</span>
            WealthTrack
          </Link>
          <div className="hidden items-center gap-6 sm:flex">
            <a className="text-sm font-medium text-muted transition-colors hover:text-ink" href="#how-it-works">How it works</a>
            <a className="text-sm font-medium text-muted transition-colors hover:text-ink" href="#privacy">Privacy</a>
          </div>
          <button aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} className="rounded-md border border-[#e1d7c3] bg-white p-2 text-slate-700 transition-colors hover:bg-stone-50 sm:hidden" onClick={() => setMenuOpen((open) => !open)} type="button">
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </nav>
        {menuOpen ? (
          <div className="border-t border-[#e8dfce] px-4 py-3 sm:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1">
              <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#f7f1e2]" href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
              <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#f7f1e2]" href="#privacy" onClick={() => setMenuOpen(false)}>Privacy</a>
            </div>
          </div>
        ) : null}
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-brand">Manual financial tracking</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Track your money without connecting your bank.</h1>
          <p className="mt-5 text-lg leading-8 text-muted">Log income, expenses, habits, and savings goals in one place.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link className={primaryButtonClass} to={primaryPath}>{primaryLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            {!isAuthenticated ? <Link className="text-sm font-bold text-brand transition-colors hover:text-[#173d2e]" to="/login">Log in</Link> : null}
          </div>
          <p className="mt-5 text-sm leading-6 text-muted">INR-first, manual tracking, and no bank login.</p>
        </div>
        <HeroMockup />
      </section>

      <section ref={featureSectionRef} className="border-y border-[#e8dfce] bg-white" id="how-it-works">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-sm font-bold text-brand">How it works</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight">Keep your financial record and next steps in the same place.</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {capabilities.map(([Icon, title, description]) => (
              <article data-feature className="border-l-2 border-[#d8e7dc] pl-5" key={title}>
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-bold text-amber">Habits and goals</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight">Transactions explain what happened. Habits help improve what happens next.</h2>
          <p className="mt-4 text-base leading-7 text-muted">Keep a small set of routines visible while tracking the goal they support. Start with logging expenses, reviewing your budget, or saving toward an emergency fund.</p>
        </div>
        <HabitGoalView />
      </section>

      <section className="border-y border-[#e8dfce] bg-white" id="privacy">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[0.36fr_0.64fr] md:items-start">
            <div>
              <p className="text-sm font-bold text-brand">Privacy</p>
              <h2 className="mt-3 text-2xl font-bold">Manual tracking, by design.</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[[LockKeyhole, "No bank login", "WealthTrack does not ask for bank credentials."], [WalletCards, "Manual tracking", "You decide what financial activity to record."], [Target, "Your data, in context", "Your information is used to show your dashboard, goals, and progress."]].map(([Icon, title, text]) => (
                <div key={title}>
                  <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-bold leading-tight">Start tracking this month.</h2>
        <p className="mt-4 text-base leading-7 text-muted">Add your first transaction and build a clearer view of your finances.</p>
        <div className="mt-7"><Link className={primaryButtonClass} to={primaryPath}>{primaryLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
      </section>

      <footer className="border-t border-[#e8dfce] py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div><p className="font-bold">WealthTrack</p><p className="mt-1 text-sm text-muted">A financial habit and wealth growth tracker.</p></div>
          <div className="flex gap-5 text-sm font-semibold text-muted"><a className="transition-colors hover:text-ink" href="#privacy">Privacy</a>{!isAuthenticated ? <Link className="transition-colors hover:text-ink" to="/login">Log in</Link> : <Link className="transition-colors hover:text-ink" to="/dashboard">Dashboard</Link>}</div>
        </div>
      </footer>
    </main>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg -rotate-1 rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_18px_48px_rgb(53,61,52,0.10)] transition-all duration-500 hover:rotate-0 sm:p-6" aria-label="WealthTrack product preview">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-xs font-extrabold text-white">W</span><div><p className="text-sm font-bold">Monthly overview</p><p className="text-xs text-muted">July 2026</p></div></div>
        <span className="rounded-full bg-[#eff5ed] px-2.5 py-1 text-xs font-bold text-brand">On track</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-stone-50 p-3"><p className="text-xs font-semibold text-muted">Savings this month</p><p className="mt-2 text-xl font-bold">₹18,500</p><p className="mt-1 text-xs font-semibold text-brand">+12% from June</p></div>
        <div className="rounded-lg bg-[#fff8dc] p-3"><p className="text-xs font-semibold text-muted">Habit rhythm</p><p className="mt-2 text-xl font-bold">4 / 5</p><p className="mt-1 text-xs font-semibold text-amber">Actions complete</p></div>
      </div>
      <div className="mt-4 rounded-lg border border-stone-100 p-4"><div className="flex items-end justify-between gap-3"><div><p className="text-sm font-bold">Spending activity</p><p className="mt-1 text-xs text-muted">A clear view of where the month is going.</p></div><p className="text-sm font-bold text-brand">₹31,240</p></div><div className="mt-5 flex h-20 items-end gap-2" aria-hidden="true">{[36, 58, 46, 74, 53, 85, 63].map((height, index) => <span className={`flex-1 rounded-t-sm ${index === 5 ? "bg-brand" : "bg-[#d8e7dc]"}`} key={height} style={{ height: `${height}%` }} />)}</div><div className="mt-2 flex justify-between text-[10px] font-medium text-muted"><span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span></div></div>
    </div>
  );
}

function HabitGoalView() {
  return <article className="rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"><div className="flex items-start justify-between border-b border-[#eee8dc] pb-4"><div><p className="text-sm font-bold">This week</p><p className="mt-1 text-sm text-muted">Three small actions to review.</p></div><PiggyBank className="h-5 w-5 text-amber" aria-hidden="true" /></div><div className="mt-2 divide-y divide-[#eee8dc]"><HabitRow complete detail="5 day streak" label="Log expenses" /><HabitRow detail="Due this week" label="Review budget" /><HabitRow goal detail="₹45,000 remaining" label="Emergency fund" /></div></article>;
}

function HabitRow({ complete, detail, goal, label }) {
  return <div className="group -mx-2 flex items-center justify-between gap-4 rounded-lg px-2 py-4 transition-colors hover:bg-stone-50"><div className="flex items-center gap-3"><span className={`grid h-6 w-6 place-items-center rounded-full transition-transform duration-200 group-hover:scale-110 ${goal ? "bg-[#fff1c7] text-amber" : complete ? "bg-brand text-white" : "border border-[#d8e7dc] text-transparent"}`}>{goal ? <PiggyBank className="h-3.5 w-3.5" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}</span><div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted">{detail}</p></div></div>{complete ? <span className="text-xs font-bold text-brand">Done</span> : null}</div>;
}
