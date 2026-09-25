"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // A ref updates instantly, unlike state, so a second click in the same
  // moment is blocked even before React re-renders the disabled button.
  const submittingRef = useRef(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submittingRef.current) return;

    if (!username.trim() || !password) {
      setError("Enter both a username and a password.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const { token } = await login({ username: username.trim(), password });
      setToken(token);
      router.replace("/products"); // stay in "loading" until the page changes
    } catch (err) {
      setError(err.message);
      submittingRef.current = false;
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-slate-900">Product Admin</h1>
        <p className="mt-1 text-sm text-slate-600">
          Log in to manage products. Demo login is filled in.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <label className="mt-5 block text-sm font-medium text-slate-800">
          Username
          <input
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-800">
          Password
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}
