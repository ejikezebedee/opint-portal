"use client";

import { useState } from "react";
import { ConfirmButton } from "@/components/confirm-button";

export function SendDigestButton({ projectId }: { projectId: string }) {
  const [message, setMessage] = useState<string | null>(null);

  async function onSend() {
    setMessage(null);
    try {
      const response = await fetch("/api/admin/delivery/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send digest");
      setMessage(`Digest sent to ${data.result.recipient}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <ConfirmButton
        label="Send Digest"
        confirmText="Send digest for this project now?"
        onConfirm={onSend}
        className="rounded-lg border border-emerald-600 px-3 py-1 text-xs text-emerald-300"
      />
      {message && <p className="text-xs text-slate-400">{message}</p>}
    </div>
  );
}
