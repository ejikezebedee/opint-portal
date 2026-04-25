"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ClientLoginForm() {
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      router.push(`/client/feed/${projectId}`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <h2 className="text-xl font-semibold">Client Portal Access</h2>
      <p className="mt-2 text-sm text-slate-300">Enter your project ID to access your opportunities feed.</p>
      <input
        type="text"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        placeholder="Project ID"
        className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
        required
      />
      <button disabled={loading} className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50">
        {loading ? "Signing in..." : "Sign in"}
      </button>
      {message && <p className="mt-3 text-sm text-rose-300">{message}</p>}
    </form>
  );
}
