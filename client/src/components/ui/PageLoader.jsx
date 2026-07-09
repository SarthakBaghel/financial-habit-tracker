export default function PageLoader({ label = "Loading your financial workspace..." }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-soft">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-brand" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </div>
  );
}
