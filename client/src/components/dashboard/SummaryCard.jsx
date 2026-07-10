export default function SummaryCard({ icon: Icon, label, value, helper, tone = "brand" }) {
  const toneClass = {
    brand: "text-brand bg-[#e6f3eb]",
    mint: "text-mint bg-[#e7f4ed]",
    amber: "text-amber bg-[#fff1c7]",
    slate: "text-analytics bg-[#e6f1f8]",
    coral: "text-coral bg-[#fff1df]"
  }[tone];

  return (
    <article className="rounded-lg border border-[#e8dfce] bg-white p-5 shadow-soft">
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
