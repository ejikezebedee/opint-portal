"use client";

import { useState } from "react";
import { ConfirmButton } from "@/components/confirm-button";

export function ReviewActions({ reviewTaskId }: { reviewTaskId: string }) {
  const [message, setMessage] = useState<string | null>(null);

  async function update(status: "approved" | "rejected") {
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/review/${reviewTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update review task");
      setMessage(`Task ${status}`);
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    }
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <ConfirmButton
        label="Approve"
        confirmText="Approve this review task?"
        onConfirm={() => update("approved")}
        className="rounded-lg bg-emerald-500 px-3 py-1 text-sm font-medium text-slate-950"
      />
      <ConfirmButton
        label="Reject"
        confirmText="Reject this review task?"
        onConfirm={() => update("rejected")}
        className="rounded-lg bg-rose-500 px-3 py-1 text-sm font-medium text-white"
      />
      {message && <p className="text-sm text-slate-400">{message}</p>}
    </div>
  );
}
