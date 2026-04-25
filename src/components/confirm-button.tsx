"use client";

import { useState } from "react";

export function ConfirmButton({
  label,
  confirmText,
  onConfirm,
  className,
}: {
  label: string;
  confirmText: string;
  onConfirm: () => Promise<void> | void;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const ok = window.confirm(confirmText);
    if (!ok) return;
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Working..." : label}
    </button>
  );
}
