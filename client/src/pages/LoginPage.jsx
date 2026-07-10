import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import AuthLayout from "../layouts/AuthLayout.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(formData);
      navigate(redirectTo, { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Pick up where your progress left off."
      description="Log in to see your latest spending, habits, savings goals, and wealth growth."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-slate-700">
          Email address
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 outline-none transition focus:border-[#1e4d3a] focus:ring-2 focus:ring-emerald-100" name="email" onChange={handleChange} required type="email" value={formData.email} />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Password
          <span className="relative mt-2 block">
            <input className="w-full rounded-md border border-slate-300 py-2.5 pl-3 pr-11 outline-none transition focus:border-[#1e4d3a] focus:ring-2 focus:ring-emerald-100" minLength={8} name="password" onChange={handleChange} required type={showPassword ? "text" : "password"} value={formData.password} />
            <button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 hover:text-[#1e4d3a]" onClick={() => setShowPassword((visible) => !visible)} title={showPassword ? "Hide password" : "Show password"} type="button">
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </span>
        </label>
        {error ? <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1e4d3a] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#173d2e] disabled:cursor-not-allowed disabled:opacity-70" disabled={submitting} type="submit"><LogIn className="h-4 w-4" aria-hidden="true" />{submitting ? "Logging in..." : "Log in to dashboard"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">New to WealthTrack? <Link className="font-bold text-[#1e4d3a] hover:text-[#173d2e]" to="/register">Create an account</Link></p>
    </AuthLayout>
  );
}
