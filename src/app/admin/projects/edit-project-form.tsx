"use client";

import { useEffect, useState } from "react";
import type { ClientRecord, ProjectRecord } from "@/lib/types";

export function EditProjectForm({ project }: { project: ProjectRecord }) {
  const [name, setName] = useState(project.name);
  const [keywords, setKeywords] = useState((project.target_keywords ?? []).join(", "));
  const [status, setStatus] = useState(project.status);
  const [clientId, setClientId] = useState(project.client_id ?? "");
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((res) => res.json())
      .then((data) => setClients(data.clients ?? []))
      .catch(() => setClients([]));
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          status,
          client_id: clientId || null,
          target_keywords: keywords.split(",").map((item) => item.trim()).filter(Boolean),
          filters: project.filters ?? {},
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update project");
      setMessage("Project updated");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">Edit Project</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" required />
        <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
          <option value="active">active</option>
          <option value="paused">paused</option>
          <option value="archived">archived</option>
        </select>
        <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
          <option value="">Unassigned client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>
      <button disabled={loading} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 disabled:opacity-50">
        {loading ? "Saving..." : "Save Project"}
      </button>
      {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
    </form>
  );
}
