"use client";

import { useState } from "react";

export function SourceForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("rss");
  const [feedUrl, setFeedUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          config: { feed_url: feedUrl },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create source");

      setMessage(`Source created: ${data.source.name}`);
      setName("");
      setFeedUrl("");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">Create Source</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Source name" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" required />
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
          <option value="rss">rss</option>
          <option value="api">api</option>
          <option value="sitemap">sitemap</option>
        </select>
        <input value={feedUrl} onChange={(e) => setFeedUrl(e.target.value)} placeholder="Feed URL" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" required />
      </div>
      <button disabled={loading} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 disabled:opacity-50">
        {loading ? "Creating..." : "Create Source"}
      </button>
      {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
    </form>
  );
}
