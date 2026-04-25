import { MetricCard } from "@/components/metric-card";
import { PageShell } from "@/components/page-shell";

async function getJson(path: string) {
  const response = await fetch(`http://127.0.0.1:3001${path}`, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

export default async function AdminDashboardPage() {
  const [dashboard, activity] = await Promise.all([
    getJson("/api/admin/dashboard"),
    getJson("/api/admin/activity"),
  ]);

  const metrics = dashboard?.metrics ?? { sources: 0, opportunities: 0, reviewTasks: 0, deliveryEvents: 0, projects: 0, clients: 0 };
  const cards = [
    ["Sources", metrics.sources, "/admin/sources"],
    ["Clients", metrics.clients, "/admin/clients"],
    ["Projects", metrics.projects, "/admin/projects"],
    ["Opportunities", metrics.opportunities, "/admin/opportunities"],
    ["Review Tasks", metrics.reviewTasks, "/admin/review"],
    ["Delivery Events", metrics.deliveryEvents, "/client/feed"],
  ] as const;

  return (
    <PageShell title="Admin Dashboard" subtitle="Live summary of the Opportunity Intelligence Platform.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {cards.map(([label, value, href]) => (
          <MetricCard key={label} label={label} value={value} href={href} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Recent Clients</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {(activity?.clients ?? []).map((client: { id: string; name: string; company: string | null }) => (
              <div key={client.id} className="rounded-xl border border-slate-800 px-4 py-3">
                <p className="font-medium">{client.name}</p>
                <p className="text-slate-400">{client.company ?? "No company"}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {(activity?.projects ?? []).map((project: { id: string; name: string; client_id: string | null }) => (
              <div key={project.id} className="rounded-xl border border-slate-800 px-4 py-3">
                <p className="font-medium">{project.name}</p>
                <p className="text-slate-400">Client: {project.client_id ?? "Unassigned"}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}