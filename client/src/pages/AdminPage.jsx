import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, CheckCircle2, MessageSquare, UsersRound } from "lucide-react";
import api from "../services/api.js";
import { formatDate } from "../utils/formatters.js";
import PageHeader from "../components/ui/PageHeader.jsx";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "feedback", label: "Feedback" }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryResponse, usersResponse, feedbackResponse] = await Promise.all([
        api.get("/admin/summary"),
        api.get("/admin/users"),
        api.get("/admin/feedback")
      ]);

      setSummary(summaryResponse.data);
      setUsers(usersResponse.data.users);
      setFeedback(feedbackResponse.data.feedback);
      setStatuses(feedbackResponse.data.statuses);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const metricCards = useMemo(
    () => [
      { label: "Total Users", value: summary?.totalUsers || 0, icon: UsersRound },
      { label: "Active Users", value: summary?.activeUsers || 0, icon: CheckCircle2 },
      { label: "Transactions", value: summary?.transactionCount || 0, icon: BarChart3 },
      { label: "Open Issues", value: (summary?.openFeedback || 0) + (summary?.inReviewFeedback || 0), icon: AlertCircle }
    ],
    [summary]
  );

  const updateFeedbackStatus = async (feedbackId, status) => {
    setError("");

    try {
      await api.patch(`/admin/feedback/${feedbackId}`, { status });
      await loadAdminData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not update feedback status.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Platform operations" title="Platform Monitor" description="Monitor users, platform activity, habit consistency, savings goal progress, and feedback issues." status="Admin view" />

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-2 border-b border-[#e8dfce]">
        {tabs.map((tab) => (
          <button
            className={`border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab === tab.id
                ? "border-brand text-brand"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm font-medium text-muted shadow-soft">
          Loading admin data...
        </div>
      ) : null}

      {!loading && activeTab === "overview" ? (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((metric) => {
              const Icon = metric.icon;
              return (
                <article className="rounded-lg border border-[#e8dfce] bg-white p-5 shadow-soft" key={metric.label}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-muted">{metric.label}</p>
                    <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-2xl font-bold">{metric.value}</p>
                </article>
              );
            })}
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <InsightTile label="Habit Completion" value={`${summary?.habitCompletionRate || 0}%`} />
            <InsightTile label="Savings Goal Completion" value={`${summary?.savingsGoalCompletionRate || 0}%`} />
            <InsightTile label="Feedback Items" value={summary?.totalFeedback || 0} />
          </section>

          <section className="rounded-lg border border-[#e8dfce] bg-white p-5 shadow-soft">
            <h2 className="text-lg font-bold">Platform Usage Analytics</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {Object.entries(summary?.platformUsage || {}).map(([key, value]) => (
                <div className="rounded-md bg-slate-50 px-3 py-3" key={key}>
                  <p className="text-xs font-semibold uppercase text-muted">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="mt-2 text-xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {!loading && activeTab === "users" ? <UsersTable users={users} /> : null}

      {!loading && activeTab === "feedback" ? (
        <FeedbackList
          feedback={feedback}
          onStatusChange={updateFeedbackStatus}
          statuses={statuses}
        />
      ) : null}
    </div>
  );
}

function InsightTile({ label, value }) {
  return (
    <article className="rounded-lg border border-[#e8dfce] bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </article>
  );
}

function UsersTable({ users }) {
  return (
    <section className="rounded-lg border border-[#e8dfce] bg-white p-5 shadow-soft">
      <div className="mb-5">
        <h2 className="text-lg font-bold">Users List</h2>
        <p className="mt-1 text-sm text-muted">Account roles and activity counts across the platform.</p>
      </div>

      {users.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e8dfce] text-xs uppercase text-muted">
                <th className="py-3 font-semibold">User</th>
                <th className="py-3 font-semibold">Role</th>
                <th className="py-3 font-semibold">Joined</th>
                <th className="py-3 font-semibold">Latest Activity</th>
                <th className="py-3 text-right font-semibold">Transactions</th>
                <th className="py-3 text-right font-semibold">Habits</th>
                <th className="py-3 text-right font-semibold">Goals</th>
                <th className="py-3 text-right font-semibold">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr className="border-b border-slate-100 last:border-0" key={user.id}>
                  <td className="py-3">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </td>
                  <td className="py-3 capitalize">{user.role}</td>
                  <td className="py-3 text-muted">{formatDate(user.createdAt)}</td>
                  <td className="py-3 text-muted">{user.latestActivity ? formatDate(user.latestActivity) : "No activity"}</td>
                  <td className="py-3 text-right font-semibold">{user.counts.transactions}</td>
                  <td className="py-3 text-right font-semibold">{user.counts.habits}</td>
                  <td className="py-3 text-right font-semibold">{user.counts.goals}</td>
                  <td className="py-3 text-right font-semibold">{user.counts.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyAdminState message="No users are available yet." />
      )}
    </section>
  );
}

function FeedbackList({ feedback, onStatusChange, statuses }) {
  return (
    <section className="rounded-lg border border-[#e8dfce] bg-white p-5 shadow-soft">
      <div className="mb-5">
        <h2 className="text-lg font-bold">Feedback & Issues</h2>
        <p className="mt-1 text-sm text-muted">Review and update user-submitted feedback status.</p>
      </div>

      {feedback.length ? (
        <div className="space-y-4">
          {feedback.map((item) => (
            <article className="rounded-lg border border-slate-200 p-4" key={item.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-brand" aria-hidden="true" />
                    <p className="font-semibold">{item.user?.name || "Unknown user"}</p>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {item.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{item.user?.email || "No email"} - {formatDate(item.createdAt)}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{item.message}</p>
                </div>
                <select
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-emerald-100"
                  onChange={(event) => onStatusChange(item.id, event.target.value)}
                  value={item.status}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyAdminState message="No feedback or issue reports have been submitted yet." />
      )}
    </section>
  );
}

function EmptyAdminState({ message }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-[#f6fbf7] px-4 py-10 text-center">
      <p className="font-semibold text-slate-800">Nothing to show</p>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </div>
  );
}
