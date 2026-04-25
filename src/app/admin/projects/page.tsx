import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ProjectForm } from "./project-form";
import { SendDigestButton } from "./send-digest-button";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { ClientRecord, DeliveryEventRecord, ProjectRecord } from "@/lib/types";

export default async function AdminProjectsPage() {
  const projects = await supabaseSelect<ProjectRecord>("projects", { order: "created_at.desc" });
  const deliveryEvents = await supabaseSelect<DeliveryEventRecord>("delivery_events", { limit: "500" });
  const clients = await supabaseSelect<ClientRecord>("clients", { limit: "500" });

  const clientMap = new Map(clients.map((client) => [client.id, client]));
  const deliveryCountByProject = new Map<string, number>();
  for (const event of deliveryEvents) {
    deliveryCountByProject.set(event.project_id, (deliveryCountByProject.get(event.project_id) ?? 0) + 1);
  }

  return (
    <PageShell title="Admin Projects" subtitle="Create and manage client delivery projects.">
      <ProjectForm />

      <div className="mt-8 grid gap-4">
        {projects.map((project) => {
          const client = project.client_id ? clientMap.get(project.client_id) : null;
          return (
            <Link key={project.id} href={`/admin/projects/${project.id}`} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-600">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="mt-2 text-sm text-slate-300">Status: {project.status}</p>
                  <p className="mt-2 text-sm text-slate-300">Keywords: {(project.target_keywords ?? []).join(", ") || "None"}</p>
                  <p className="mt-2 text-sm text-slate-400">Client: {client ? `${client.name}${client.email ? ` (${client.email})` : ""}` : "Unassigned"}</p>
                  <p className="mt-2 text-xs text-slate-500">Created: {new Date(project.created_at).toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-cyan-800 px-4 py-3 text-sm text-cyan-300">
                  Delivery events: {deliveryCountByProject.get(project.id) ?? 0}
                </div>
              </div>
              <SendDigestButton projectId={project.id} />
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
