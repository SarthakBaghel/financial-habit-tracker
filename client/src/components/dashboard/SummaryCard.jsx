export default function SummaryCard({ icon: Icon, label, value, helper, tone = "brand" }) {
  const toneClass = {
    brand: "text-brand bg-blue-50",
    mint: "text-mint bg-teal-50",
    amber: "text-amber bg-amber-50",
    slate: "text-slate-700 bg-slate-100"
  }[tone];

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-3 text-2xl font-bold">{value}</p>
        </div>
        <span className={`rounded-md p-2 ${toneClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">{helper}</p>
    </article>
  );
}
