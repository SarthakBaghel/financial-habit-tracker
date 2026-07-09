import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Edit2, PiggyBank, Plus, Target, Trash2 } from "lucide-react";
import api from "../services/api.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import useAuth from "../hooks/useAuth.js";

const initialForm = {
  title: "",
  targetAmount: "",
  currentAmount: "",
  deadline: "",
  category: "Emergency Fund",
  status: "active"
};

const goalCategories = ["Emergency Fund", "Travel", "Education", "Home", "Vehicle", "Investment", "General"];

export default function SavingsGoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [progressAmount, setProgressAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currency = user?.currencyPreference || "INR";
  const selectedGoal = useMemo(
    () => goals.find((goal) => goal.id === selectedGoalId) || goals[0] || null,
    [goals, selectedGoalId]
  );

  const loadGoals = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/savings-goals");
      setGoals(response.data.goals);
      setSummary(response.data.summary);

      if (!selectedGoalId && response.data.goals.length) {
        setSelectedGoalId(response.data.goals[0].id);
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load savings goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProgressAmount(selectedGoal?.currentAmount ?? "");
  }, [selectedGoal]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...formData,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount || 0)
    };

    try {
      if (editingId) {
        await api.put(`/savings-goals/${editingId}`, payload);
      } else {
        await api.post("/savings-goals", payload);
      }

      resetForm();
      await loadGoals();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not save savings goal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal.id);
    setSelectedGoalId(goal.id);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().slice(0, 10) : "",
      category: goal.category,
      status: goal.status
    });
  };

  const handleDelete = async (goalId) => {
    setError("");

    try {
      await api.delete(`/savings-goals/${goalId}`);
      if (selectedGoalId === goalId) {
        setSelectedGoalId(null);
      }
      await loadGoals();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not delete savings goal.");
    }
  };

  const updateProgress = async (event) => {
    event.preventDefault();

    if (!selectedGoal) {
      return;
    }

    setError("");

    try {
      await api.patch(`/savings-goals/${selectedGoal.id}/progress`, {
        currentAmount: Number(progressAmount || 0)
      });
      await loadGoals();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not update goal progress.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-sm font-semibold text-brand">Savings Goals</p>
        <h1 className="mt-1 text-3xl font-bold">Goal Progress</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Create savings targets, update saved amounts, and monitor whether each goal is on track.
        </p>
      </header>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile icon={Target} label="Total Goals" value={summary?.totalGoals || 0} />
        <SummaryTile icon={CheckCircle2} label="Completed" value={summary?.completedGoals || 0} />
        <SummaryTile icon={PiggyBank} label="Total Saved" value={formatCurrency(summary?.totalSaved, currency)} />
        <SummaryTile icon={Target} label="Remaining" value={formatCurrency(summary?.remainingAmount, currency)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
          <div className="mb-4">
            <h2 className="text-lg font-bold">{editingId ? "Edit Goal" : "Create Goal"}</h2>
            <p className="mt-1 text-sm text-muted">Add a target amount, saved amount, deadline, and category.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Goal title
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="title"
                onChange={handleChange}
                placeholder="Build emergency fund"
                required
                type="text"
                value={formData.title}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Category
              <select
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="category"
                onChange={handleChange}
                value={formData.category}
              >
                {goalCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Target amount
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  min="1"
                  name="targetAmount"
                  onChange={handleChange}
                  required
                  type="number"
                  value={formData.targetAmount}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Current saved
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  min="0"
                  name="currentAmount"
                  onChange={handleChange}
                  type="number"
                  value={formData.currentAmount}
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Deadline
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="deadline"
                onChange={handleChange}
                type="date"
                value={formData.deadline}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Lifecycle status
              <select
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="status"
                onChange={handleChange}
                value={formData.status}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-blue-700 disabled:opacity-70"
              disabled={submitting}
              type="submit"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {editingId ? "Update Goal" : "Create Goal"}
            </button>
            {editingId ? (
              <button
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={resetForm}
                type="button"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="grid gap-6 2xl:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-5">
              <h2 className="text-lg font-bold">Goal List</h2>
              <p className="mt-1 text-sm text-muted">Select a goal to view details and update progress.</p>
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm font-medium text-muted">Loading savings goals...</p>
            ) : goals.length ? (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <article
                    className={`rounded-lg border p-4 ${
                      selectedGoal?.id === goal.id ? "border-brand bg-blue-50/40" : "border-slate-200"
                    }`}
                    key={goal.id}
                  >
                    <button className="w-full text-left" onClick={() => setSelectedGoalId(goal.id)} type="button">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{goal.title}</h3>
                            <StatusBadge status={goal.displayStatus} />
                          </div>
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
                        {formatCurrency(goal.currentAmount, currency)} saved of{" "}
                        {formatCurrency(goal.targetAmount, currency)}
                      </p>
                    </button>

                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      <button
                        className="rounded-md border border-slate-200 p-2 text-slate-700 hover:bg-white"
                        onClick={() => handleEdit(goal)}
                        title="Edit goal"
                        type="button"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(goal.id)}
                        title="Delete goal"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                <p className="font-semibold text-slate-800">No savings goals yet</p>
                <p className="mt-2 text-sm text-muted">Create your first savings goal from the form.</p>
              </div>
            )}
          </section>

          <GoalDetails
            currency={currency}
            goal={selectedGoal}
            onProgressSubmit={updateProgress}
            progressAmount={progressAmount}
            setProgressAmount={setProgressAmount}
          />
        </div>
      </section>
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted">{label}</p>
        <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </article>
  );
}

function StatusBadge({ status }) {
  const className = {
    "On track": "bg-teal-50 text-mint",
    Behind: "bg-amber-50 text-amber",
    Completed: "bg-blue-50 text-brand",
    Paused: "bg-slate-100 text-slate-700"
  }[status];

  return <span className={`rounded-md px-2 py-1 text-xs font-semibold ${className}`}>{status}</span>;
}

function GoalDetails({ currency, goal, onProgressSubmit, progressAmount, setProgressAmount }) {
  if (!goal) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-bold">Goal Details</h2>
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
          <p className="font-semibold text-slate-800">Select a goal</p>
          <p className="mt-2 text-sm text-muted">Progress details will appear here.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Goal Details</h2>
          <p className="mt-1 text-sm text-muted">{goal.title}</p>
        </div>
        <StatusBadge status={goal.displayStatus} />
      </div>

      <dl className="mt-5 space-y-4">
        <DetailRow label="Target" value={formatCurrency(goal.targetAmount, currency)} />
        <DetailRow label="Saved" value={formatCurrency(goal.currentAmount, currency)} />
        <DetailRow label="Remaining" value={formatCurrency(goal.remainingAmount, currency)} />
        <DetailRow label="Deadline" value={goal.deadline ? formatDate(goal.deadline) : "No deadline"} />
        <DetailRow label="Progress" value={`${goal.progress}%`} />
      </dl>

      <div className="mt-5 h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-brand" style={{ width: `${goal.progress}%` }} />
      </div>

      <form className="mt-6" onSubmit={onProgressSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Update saved amount
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            min="0"
            onChange={(event) => setProgressAmount(event.target.value)}
            type="number"
            value={progressAmount}
          />
        </label>
        <button
          className="mt-4 w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-blue-700"
          type="submit"
        >
          Update Progress
        </button>
      </form>
    </aside>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}
