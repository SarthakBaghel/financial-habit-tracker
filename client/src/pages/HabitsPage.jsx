import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Flame, Plus, Trash2 } from "lucide-react";
import api from "../services/api.js";

const starterHabits = [
  "Save money today",
  "Log expenses",
  "Review budget",
  "Avoid unnecessary spending",
  "Invest monthly",
  "Check savings goal progress"
];

const initialForm = {
  habitName: "Log expenses",
  frequency: "daily",
  target: 1
};

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadHabits = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/habits");
      setHabits(response.data.habits);
      setSummary(response.data.summary);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load habits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post("/habits", {
        ...formData,
        target: Number(formData.target || 1)
      });
      setFormData(initialForm);
      await loadHabits();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not save habit.");
    } finally {
      setSubmitting(false);
    }
  };

  const markHabit = async (habitId, completed = true) => {
    setError("");

    try {
      await api.post(`/habits/${habitId}/log`, { completed });
      await loadHabits();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not update habit progress.");
    }
  };

  const deleteHabit = async (habitId) => {
    setError("");

    try {
      await api.delete(`/habits/${habitId}`);
      await loadHabits();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not delete habit.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-sm font-semibold text-brand">Financial Habit Tracker</p>
        <h1 className="mt-1 text-3xl font-bold">Habits</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Create financial routines, mark completions, and track streaks, completion rates, and missed habits.
        </p>
      </header>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile icon={CheckCircle2} label="Active Habits" value={summary?.activeHabits || 0} />
        <SummaryTile icon={Clock3} label="Completion Rate" value={`${summary?.completionRate || 0}%`} />
        <SummaryTile icon={Clock3} label="Missed Habits" value={summary?.missedHabits || 0} />
        <SummaryTile icon={Flame} label="Best Streak" value={`${summary?.bestStreak || 0}`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
            <div className="mb-4">
              <h2 className="text-lg font-bold">Create Habit</h2>
              <p className="mt-1 text-sm text-muted">Pick a money routine and set how often it should happen.</p>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Habit
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                list="starter-habits"
                name="habitName"
                onChange={handleChange}
                required
                type="text"
                value={formData.habitName}
              />
              <datalist id="starter-habits">
                {starterHabits.map((habit) => (
                  <option key={habit} value={habit} />
                ))}
              </datalist>
            </label>

            <label className="mt-4 block text-sm font-medium text-slate-700">
              Frequency
              <select
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="frequency"
                onChange={handleChange}
                value={formData.frequency}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium text-slate-700">
              Target completions per period
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                min="1"
                name="target"
                onChange={handleChange}
                type="number"
                value={formData.target}
              />
            </label>

            <button
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-blue-700 disabled:opacity-70"
              disabled={submitting}
              type="submit"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Habit
            </button>
          </form>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-bold">Simple Reminders</h2>
            <div className="mt-4 space-y-3">
              {starterHabits.slice(0, 4).map((habit) => (
                <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700" key={habit}>
                  {habit}
                </p>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5">
            <h2 className="text-lg font-bold">Habit Progress Dashboard</h2>
            <p className="mt-1 text-sm text-muted">Mark habits complete and watch streaks update.</p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm font-medium text-muted">Loading habits...</p>
          ) : habits.length ? (
            <div className="space-y-4">
              {habits.map((habit) => (
                <article className="rounded-lg border border-slate-200 p-4" key={habit.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{habit.habitName}</h3>
                        <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold capitalize text-brand">
                          {habit.frequency}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        Streak: {habit.streak} - Completion: {habit.stats.completionRate}% - Missed:{" "}
                        {habit.stats.missedCount}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-mint px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                        onClick={() => markHabit(habit.id, true)}
                        type="button"
                      >
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Complete
                      </button>
                      <button
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        onClick={() => markHabit(habit.id, false)}
                        type="button"
                      >
                        Missed
                      </button>
                      <button
                        className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        onClick={() => deleteHabit(habit.id)}
                        title="Delete habit"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-mint" style={{ width: `${habit.stats.completionRate}%` }} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
              <p className="font-semibold text-slate-800">No habits yet</p>
              <p className="mt-2 text-sm text-muted">Create your first financial habit from the form.</p>
            </div>
          )}
        </section>
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
