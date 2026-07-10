export default function EmptyState({ action, message, title }) {
  return (
    <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-[#d8e7dc] bg-[#f6fbf7] px-4 text-center">
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
