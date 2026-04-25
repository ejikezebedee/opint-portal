"use client";

import { useState } from "react";

export function OpportunityActions({ opportunityId }: { opportunityId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function post(path: string, label: string) {
    setLoading(label);
    setMessage(null);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to ${label}`);
      setMessage(`${label} completed`);
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button onClick={() => post("/api/admin/review/seed", "Seed review")} disabled={!!loading} className="rounded-lg border border-amber-600 px-3 py-1 text-xs text-amber-300 disabled:opacity-50">
        {loading === "Seed review" ? "Seeding..." : "Seed review"}
      </button>
      <button onClick={() => post("/api/admin/delivery/run", "Run delivery")} disabled={!!loading} className="rounded-lg border border-cyan-600 px-3 py-1 text-xs text-cyan-300 disabled:opacity-50">
        {loading === "Run delivery" ? "Running..." : "Run delivery"}
      </button>
      {message && <p className="text-xs text-slate-400">{message}</p>}
    </div>
  );
}
