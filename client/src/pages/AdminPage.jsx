import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function AdminPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/summary")
      .then((response) => setSummary(response.data))
      .catch((apiError) => {
        setError(apiError.response?.data?.message || "Could not load admin summary.");
      });
  }, []);

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-sm font-semibold text-brand">Admin</p>
        <h1 className="mt-1 text-3xl font-bold">Platform Summary</h1>
      </header>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary
          ? Object.entries(summary).map(([key, value]) => (
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" key={key}>
                <p className="text-sm font-medium capitalize text-muted">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="mt-3 text-2xl font-bold">{value}</p>
              </article>
            ))
          : null}
      </section>
    </div>
  );
}
