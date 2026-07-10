export default function PageHeader({ actions, description, eyebrow, status, statusTone = "on_track", title }) {
  const statusClass = {
    on_track: "bg-[#e6f3eb] text-brand",
    met: "bg-[#fff1c7] text-amber",
    behind: "bg-[#fff1df] text-coral",
    neutral: "bg-slate-100 text-slate-600"
  }[statusTone] || "bg-[#e6f3eb] text-brand";

  return (
    <header className="flex flex-col gap-4 border-b border-[#e8dfce] pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-brand">{eyebrow}</p>
          {status ? <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass}`}>{status}</span> : null}
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
