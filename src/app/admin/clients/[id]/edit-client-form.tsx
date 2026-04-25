"use client";

import { useState } from "react";
import type { ClientRecord } from "@/lib/types";

export function EditClientForm({ client }: { client: ClientRecord }) {
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email ?? "");
  const [company, setCompany] = useState(client.company ?? "");
  const [status, setStatus] = useState(client.status);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update client");
      setMessage("Client updated");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">Edit Client</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
        <input value={company} onChange={(e) => setCompany(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </div>
      <button disabled={loading} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 disabled:opacity-50">
        {loading ? "Saving..." : "Save Client"}
      </button>
      {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
    </form>
  );
}
