export default function ChartPanel({ children, description, title }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      <div className="h-72 min-h-72 w-full">{children}</div>
    </section>
  );
}
