import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function AuthLayout({ eyebrow, title, description, children }) {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-ink">
      <header className="border-b border-[#e8dfce] bg-[#fffdf8]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2 text-base font-bold" to="/">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-xs font-extrabold text-white">W</span>
            WealthTrack
          </Link>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-brand" to="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-md items-center px-4 py-14 sm:px-6">
        <div className="w-full animate-[auth-enter_360ms_ease-out]" key={location.pathname}>
          <p className="text-sm font-bold text-brand">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">{description}</p>
          <div className="mt-8 rounded-2xl border border-stone-100/80 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-6">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
