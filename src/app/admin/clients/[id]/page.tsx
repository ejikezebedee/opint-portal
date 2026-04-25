import { PageShell } from "@/components/page-shell";
import { DeliveryPreferencesForm } from "./delivery-preferences-form";
import { EditClientForm } from "./edit-client-form";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { ClientRecord, DeliveryEventRecord, DeliveryPreferenceRecord, ProjectRecord } from "@/lib/types";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const clientId = (await params).id;
  const clients = await supabaseSelect<ClientRecord>("clients", { id: `eq.${clientId}` });
  const projects = await supabaseSelect<ProjectRecord>("projects", { client_id: `eq.${clientId}`, order: "created_at.desc" });
  const deliveryEvents = await supabaseSelect<DeliveryEventRecord>("delivery_events", { limit: "500" });
  const preferences = await supabaseSelect<DeliveryPreferenceRecord>("delivery_preferences", { client_id: `eq.${clientId}`, limit: "1" });

  const client = clients[0] ?? null;
  const preference = preferences[0] ?? null;
  const deliveryCountByProject = new Map<string, number>();
  for (const event of deliveryEvents) {
    deliveryCountByProject.set(event.project_id, (deliveryCountByProject.get(event.project_id) ?? 0) + 1);
  }

  return (
    <PageShell title={client ? client.name : "Client"} subtitle="Client account and owned projects.">
      {client ? <EditClientForm client={client} /> : null}

      {client ? (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-300">Company: {client.company ?? "N/A"}</p>
          <p className="mt-1 text-sm text-slate-300">Email: {client.email ?? "N/A"}</p>
          <p className="mt-1 text-sm text-slate-300">Status: {client.status}</p>
          {preference ? (
            <p className="mt-2 text-sm text-cyan-300">Digest: {preference.frequency} at {preference.preferred_hour}:00 {preference.timezone}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No delivery preferences set yet.</p>
          )}
        </div>
      ) : null}

      <div className="mt-8">
        <DeliveryPreferencesForm clientId={clientId} />
      </div>

      <div className="mt-8 grid gap-4">
        {projects.map((project) => (
          <article key={project.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="mt-2 text-sm text-slate-300">Keywords: {(project.target_keywords ?? []).join(", ") || "None"}</p>
            <p className="mt-2 text-sm text-cyan-300">Delivery events: {deliveryCountByProject.get(project.id) ?? 0}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
