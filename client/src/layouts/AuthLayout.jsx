import { ArrowLeft, BarChart3, CheckCircle2, PiggyBank, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const previewMetrics = [
  ["Savings rate", "31%", "text-[#1e4d3a]"],
  ["Habit streak", "12 days", "text-[#b45309]"],
  ["Goal progress", "64%", "text-[#0d5d86]"]
];

export default function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-5 text-slate-950 sm:px-6 lg:grid lg:grid-cols-2 lg:items-stretch lg:p-0">
      <section className="mx-auto flex w-full max-w-xl flex-col py-4 lg:mx-0 lg:max-w-none lg:px-[clamp(2rem,8vw,8rem)] lg:py-10">
        <Link className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#1e4d3a]" to="/">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to WealthTrack
        </Link>

        <Link className="mt-8 flex items-center gap-2 text-lg font-bold text-slate-950 lg:mt-12" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[#1e4d3a] text-sm font-extrabold text-white">W</span>
          WealthTrack
        </Link>

        <div className="mt-12 w-full lg:mt-14">
          <p className="text-sm font-bold text-[#1e4d3a]">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-7 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">{children}</div>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-[#173d2e] p-10 text-white lg:flex lg:flex-col lg:justify-center xl:px-[clamp(3rem,8vw,9rem)]">
        <div className="absolute right-10 top-10 h-28 w-28 rounded-md bg-[#f4c95d]" aria-hidden="true" />
        <div className="relative max-w-lg">
          <p className="text-sm font-bold uppercase tracking-wide text-[#f4c95d]">Keep the momentum</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight">Small money actions become visible progress.</h2>
          <p className="mt-4 max-w-md text-base leading-7 text-emerald-50/80">Return to a dashboard that connects your daily financial choices to savings goals and long-term growth.</p>

          <div className="mt-10 rounded-lg border border-white/15 bg-[#fffdf8] p-5 text-slate-950 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Your overview</p>
                <p className="mt-1 text-lg font-bold">Financial progress</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#1e4d3a]">On track</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {previewMetrics.map(([label, value, color]) => (
                <div className="rounded-md bg-slate-50 p-3" key={label}>
                  <p className="text-[11px] font-semibold text-slate-500">{label}</p>
                  <p className={`mt-3 text-lg font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4 rounded-md border border-slate-100 p-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold"><TrendingUp className="h-4 w-4 text-[#1e4d3a]" aria-hidden="true" />Wealth growth</div>
                <div className="mt-4 flex h-16 items-end gap-2">{[32, 42, 38, 56, 63, 78].map((height, index) => <div className="flex h-full flex-1 flex-col justify-end" key={height}><div className={`rounded-sm ${index === 5 ? "bg-[#1e4d3a]" : "bg-[#b9dcc9]"}`} style={{ height: `${height}%` }} /></div>)}</div>
              </div>
              <div className="flex flex-col gap-2 text-slate-500"><PiggyBank className="h-5 w-5 text-[#b45309]" aria-hidden="true" /><BarChart3 className="h-5 w-5 text-[#0d5d86]" aria-hidden="true" /><CheckCircle2 className="h-5 w-5 text-[#1e4d3a]" aria-hidden="true" /></div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
