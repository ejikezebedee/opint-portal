"use client";

import { useEffect, useState } from "react";

type ClientOption = {
  id: string;
  name: string;
};

export function ProjectForm() {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState<ClientOption[]>([]);
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
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          target_keywords: keywords,
          client_id: clientId || null,
          filters: {},
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create project");
      setMessage(`Project created: ${data.project.name}`);
      setName("");
      setKeywords("");
      setClientId("");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">Create Project</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" required />
        <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords, comma separated" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
        <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
          <option value="">Unassigned client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>
      <button disabled={loading} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 disabled:opacity-50">
        {loading ? "Creating..." : "Create Project"}
      </button>
      {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
    </form>
  );
}
