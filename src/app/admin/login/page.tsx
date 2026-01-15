"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.replace(from);
    } else {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      setError(data.error || "Unable to sign in.");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="panel space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Admin sign in</h1>
        <p className="text-sm text-slate-600">Enter the admin password to continue.</p>
      </div>
      <form onSubmit={handleSubmit} className="panel space-y-4">
        <label className="text-sm font-semibold text-slate-800">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-100 focus:ring-2 focus:ring-sky-500"
            placeholder="Admin password"
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="text-sm text-amber-700">{error}</p>}
      </form>
    </div>
  );
}
