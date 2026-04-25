"use client";

import { useState } from "react";

export function RunButton({ sourceId }: { sourceId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function runNow() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/run-ingestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to run ingestion");
      setMessage("Ingestion completed");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button onClick={runNow} disabled={loading} className="rounded-lg border border-cyan-700 px-3 py-1 text-xs text-cyan-300 disabled:opacity-50">
        {loading ? "Running..." : "Run ingestion"}
      </button>
      {message && <p className="text-xs text-slate-400">{message}</p>}
    </div>
  );
}
