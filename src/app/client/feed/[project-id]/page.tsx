import { PageShell } from "@/components/page-shell";
import { ClientLogoutButton } from "@/components/client-logout-button";
import type { DeliveryEventRecord, OpportunityRecord, ProjectRecord } from "@/lib/types";
import { supabaseSelect } from "@/lib/supabase-rest";

export default async function ClientFeedProjectPage({ params }: { params: Promise<{ project_id: string }> }) {
  const clientProjectId = (await params).project_id;

  const projects: ProjectRecord[] = [];
  const events: DeliveryEventRecord[] = [];
  const opportunities: OpportunityRecord[] = [];

  if (clientProjectId) {
    const projectResult = await supabaseSelect<ProjectRecord>("projects", { id: `eq.${clientProjectId}` });
    projects.push(...projectResult);

    const eventsResult = await supabaseSelect<DeliveryEventRecord>("delivery_events", {
      project_id: `eq.${clientProjectId}`,
      order: "created_at.desc",
      limit: "50",
    });
    events.push(...eventsResult);

    for (const event of events) {
      const rows = await supabaseSelect<OpportunityRecord>("opportunities", {
        id: `eq.${event.opportunity_id}`,
        limit: "1",
      });
      if (rows[0]) opportunities.push(rows[0]);
    }
  }

  return (
    <PageShell title="Client Feed" subtitle="Your project delivery feed.">
      {clientProjectId ? (
        projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-slate-400">No active project found.</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-xl font-semibold">{projects[0].name}</h2>
                <p className="mt-2 text-sm text-slate-300">Keywords: {(projects[0].target_keywords ?? []).join(", ") || "None"}</p>
                <p className="mt-2 text-sm text-slate-300">Delivery events: {events.length}</p>
                <div className="mt-4 space-y-2">
                  {projects[0].target_keywords?.slice(0, 10).map((keyword) => (
                    <span key={keyword} className="rounded-full border border-cyan-700 px-2 py-1 text-xs text-cyan-300">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-4">
                {opportunities.map((opportunity) => (
                  <article key={opportunity.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <h2 className="text-xl font-semibold">{opportunity.title}</h2>
                    <p className="mt-1 text-sm text-slate-300">{opportunity.company_name ?? "Unknown company"} · {opportunity.location ?? "Unknown location"}</p>
                    <p className="mt-3 text-sm text-slate-400">{opportunity.description ?? "No description available."}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-slate-400">
          <p className="mb-4 font-semibold">No active project found.</p>
          <p>Log in with your project ID to access your opportunities.</p>
        </div>
      )}

      {clientProjectId && (
        <div className="mt-8 flex items-center justify-end gap-3">
          <span className="text-xs text-slate-500">Client Access: {clientProjectId}</span>
          <ClientLogoutButton />
        </div>
      )}
    </PageShell>
  );
}