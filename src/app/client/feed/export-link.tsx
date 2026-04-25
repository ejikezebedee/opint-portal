"use client";

export function ExportLink({ projectId }: { projectId: string }) {
  return (
    <a
      href={`/api/client/export?projectId=${projectId}`}
      className="inline-flex rounded-xl border border-cyan-700 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-slate-900"
    >
      Export CSV
    </a>
  );
}
