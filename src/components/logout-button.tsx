"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={onLogout} disabled={loading} className="rounded-lg border border-rose-700 px-3 py-2 text-sm text-rose-300 disabled:opacity-50">
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
