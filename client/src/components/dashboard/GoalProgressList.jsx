import { formatCurrency, formatDate } from "../../utils/formatters.js";
import { Link } from "react-router-dom";

export default function GoalProgressList({ currency, goals }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4">
        <h3 className="text-lg font-bold">Savings Goal Progress</h3>
        <p className="mt-1 text-sm text-muted">Goal completion based on saved amount versus target.</p>
      </div>

      {goals.length ? (
        <div className="space-y-4">
          {goals.map((goal) => (
            <article className="rounded-lg border border-slate-200 p-4" key={goal.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold">{goal.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {goal.category} {goal.deadline ? `- due ${formatDate(goal.deadline)}` : ""}
                  </p>
                </div>
                <p className="text-sm font-semibold text-brand">{goal.progress}%</p>
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${goal.progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted">
                {formatCurrency(goal.currentAmount, currency)} saved of {formatCurrency(goal.targetAmount, currency)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="font-semibold text-slate-800">No savings goals yet</p>
          <p className="mt-2 text-sm text-muted">Create goals to track target amounts, deadlines, and progress.</p>
          <Link
            className="mt-4 inline-flex rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            to="/savings-goals"
          >
            Create Goal
          </Link>
        </div>
      )}
    </section>
  );
}
