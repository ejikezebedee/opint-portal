"use client";

import { useState } from "react";

export function DeliveryPreferencesForm({ clientId }: { clientId: string }) {
  const [frequency, setFrequency] = useState("manual");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [csvEnabled, setCsvEnabled] = useState(true);
  const [preferredHour, setPreferredHour] = useState(9);
  const [timezone, setTimezone] = useState("UTC");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/delivery-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          frequency,
          email_enabled: emailEnabled,
          csv_enabled: csvEnabled,
          preferred_hour: preferredHour,
          timezone,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save delivery preferences");
      setMessage("Delivery preferences saved");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">Delivery Preferences</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
          <option value="manual">Manual</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <input type="number" min="0" max="23" value={preferredHour} onChange={(e) => setPreferredHour(Number(e.target.value))} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
        <input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Timezone" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} /> Email</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={csvEnabled} onChange={(e) => setCsvEnabled(e.target.checked)} /> CSV</label>
        </div>
      </div>
      <button disabled={loading} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 disabled:opacity-50">
        {loading ? "Saving..." : "Save Preferences"}
      </button>
      {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
    </form>
  );
}
