import { PageShell } from "@/components/page-shell";
import type { SourceRecord } from "@/lib/types";
import { supabaseSelect } from "@/lib/supabase-rest";
import { SourceForm } from "./source-form";
import { RunButton } from "./run-button";

export default async function AdminSourcesPage() {
  const sources = await supabaseSelect<SourceRecord>("sources", { order: "created_at.desc" });

  return (
    <PageShell title="Admin Sources" subtitle="Live source registry from Supabase.">
      <SourceForm />

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80 text-left text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Last Run</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sources.map((source) => (
              <tr key={source.id}>
                <td className="px-4 py-3 font-medium">{source.name}</td>
                <td className="px-4 py-3">{source.type}</td>
                <td className="px-4 py-3">{source.is_active ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{source.last_run_at ?? "Never"}</td>
                <td className="px-4 py-3">{new Date(source.created_at).toLocaleString()}</td>
                <td className="px-4 py-3"><RunButton sourceId={source.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
