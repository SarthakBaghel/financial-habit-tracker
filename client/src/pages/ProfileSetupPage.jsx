import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import PageHeader from "../components/ui/PageHeader.jsx";

export default function ProfileSetupPage() {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthlyIncomeTarget: profile?.monthlyIncomeTarget || "",
    savingsTarget: profile?.savingsTarget || "",
    riskPreference: profile?.riskPreference || "moderate",
    primaryGoal: profile?.financialGoals?.[0]?.title || ""
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      monthlyIncomeTarget: Number(formData.monthlyIncomeTarget || 0),
      savingsTarget: Number(formData.savingsTarget || 0),
      riskPreference: formData.riskPreference,
      financialGoals: formData.primaryGoal
        ? [
            {
              title: formData.primaryGoal,
              priority: "high",
              status: "active"
            }
          ]
        : []
    };

    try {
      await updateProfile(payload);
      navigate("/dashboard", { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not save profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6"><PageHeader eyebrow="Your starting point" title="Set your financial baseline" description="These values help personalize dashboard summaries, savings targets, and future habit recommendations." status="Profile" /></div>

      <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Monthly income target
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-emerald-100"
              min="0"
              name="monthlyIncomeTarget"
              onChange={handleChange}
              type="number"
              value={formData.monthlyIncomeTarget}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Monthly savings target
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-emerald-100"
              min="0"
              name="savingsTarget"
              onChange={handleChange}
              type="number"
              value={formData.savingsTarget}
            />
          </label>
        </div>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Risk preference
          <select
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-emerald-100"
            name="riskPreference"
            onChange={handleChange}
            value={formData.riskPreference}
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Primary financial goal
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-emerald-100"
            name="primaryGoal"
            onChange={handleChange}
            placeholder="Build an emergency fund"
            type="text"
            value={formData.primaryGoal}
          />
        </label>

        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <button
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-[#173d2e] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={submitting}
          type="submit"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {submitting ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}
