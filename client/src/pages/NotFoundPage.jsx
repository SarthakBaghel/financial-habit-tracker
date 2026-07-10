import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[65vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-md border border-slate-200 bg-white p-6 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">404</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">Page not found</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          This workspace page does not exist or may have moved. Head back to your dashboard to continue tracking your finances.
        </p>
        <Link
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          to="/dashboard"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Go to dashboard
        </Link>
      </div>
    </section>
  );
}
