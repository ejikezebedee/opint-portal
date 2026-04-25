import { PageShell } from "@/components/page-shell";

async function getAnalytics() {
  const response = await fetch("http://127.0.0.1:3001/api/admin/analytics", { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalytics();
  const totals = data?.totals ?? { sources: 0, opportunities: 0, reviews: 0, deliveries: 0, clients: 0, projects: 0 };
  const sourceStats = data?.sourceStats ?? [];
  const reviewStats = data?.reviewStats ?? { total: 0, approved: 0, rejected: 0, pending: 0 };
  const clientStats = data?.clientStats ?? [];
  const projectStats = data?.projectStats ?? [];

  return (
    <PageShell title="Analytics" subtitle="Source intelligence and platform performance analytics.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {Object.entries(totals).map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm capitalize text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-bold">{String(value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Source Scorecards</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {sourceStats.map((source: { id: string; name: string; type: string; opportunities: number; avg_quality: number; last_run_at: string | null }) => (
              <div key={source.id} className="rounded-xl border border-slate-800 px-4 py-3">
                <p className="font-medium">{source.name}</p>
                <p className="text-slate-400">Type: {source.type}</p>
                <p className="text-slate-400">Opportunities: {source.opportunities}</p>
                <p className="text-slate-400">Avg quality: {source.avg_quality}</p>
                <p className="text-slate-500">Last run: {source.last_run_at ?? "Never"}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Review Analytics</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-xl border border-slate-800 px-4 py-3">Total: {reviewStats.total}</div>
            <div className="rounded-xl border border-slate-800 px-4 py-3">Approved: {reviewStats.approved}</div>
            <div className="rounded-xl border border-slate-800 px-4 py-3">Rejected: {reviewStats.rejected}</div>
            <div className="rounded-xl border border-slate-800 px-4 py-3">Pending: {reviewStats.pending}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Client Performance</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {clientStats.map((client: { id: string; name: string; projects: number; deliveries: number }) => (
              <div key={client.id} className="rounded-xl border border-slate-800 px-4 py-3">
                <p className="font-medium">{client.name}</p>
                <p className="text-slate-400">Projects: {client.projects}</p>
                <p className="text-slate-400">Deliveries: {client.deliveries}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Project Performance</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {projectStats.map((project: { id: string; name: string; client_id: string | null; deliveries: number }) => (
              <div key={project.id} className="rounded-xl border border-slate-800 px-4 py-3">
                <p className="font-medium">{project.name}</p>
                <p className="text-slate-400">Client: {project.client_id ?? "Unassigned"}</p>
                <p className="text-slate-400">Deliveries: {project.deliveries}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
