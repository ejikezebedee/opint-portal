"use client";

import { useState } from "react";

export function ClientForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create client");
      setMessage(`Client created: ${data.client.name}`);
      setName("");
      setEmail("");
      setCompany("");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">Create Client</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
      </div>
      <button disabled={loading} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 disabled:opacity-50">
        {loading ? "Creating..." : "Create Client"}
      </button>
      {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
    </form>
  );
}
