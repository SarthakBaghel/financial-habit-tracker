import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import AuthLayout from "../layouts/AuthLayout.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", currencyPreference: "INR" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(formData);
      navigate("/dashboard/profile-setup", { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Start your financial rhythm"
      title="Build a clearer relationship with your money."
      description="Create a free workspace, set your financial baseline, and begin with the habits that matter most."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-slate-700">Your name<input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 outline-none transition-all focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10" name="name" onChange={handleChange} required type="text" value={formData.name} /></label>
        <label className="block text-sm font-semibold text-slate-700">Email address<input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 outline-none transition-all focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10" name="email" onChange={handleChange} required type="email" value={formData.email} /></label>
        <label className="block text-sm font-semibold text-slate-700">Password<span className="relative mt-2 block"><input className="w-full rounded-md border border-slate-300 py-2.5 pl-3 pr-11 outline-none transition-all focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10" minLength={8} name="password" onChange={handleChange} required type={showPassword ? "text" : "password"} value={formData.password} /><button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 hover:text-[#1e4d3a]" onClick={() => setShowPassword((visible) => !visible)} title={showPassword ? "Hide password" : "Show password"} type="button">{showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}</button></span></label>
        <label className="block text-sm font-semibold text-slate-700">Preferred currency<select className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 outline-none transition-all focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10" name="currencyPreference" onChange={handleChange} value={formData.currencyPreference}><option value="INR">INR (₹)</option><option value="USD">USD ($)</option></select></label>
        {error ? <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1e4d3a] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#173d2e] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70" disabled={submitting} type="submit"><UserPlus className="h-4 w-4" aria-hidden="true" />{submitting ? "Creating your account..." : "Create your workspace"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">Already tracking with WealthTrack? <Link className="font-bold text-[#1e4d3a] hover:text-[#173d2e]" to="/login">Log in</Link></p>
    </AuthLayout>
  );
}
