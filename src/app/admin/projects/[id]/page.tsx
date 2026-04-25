import { PageShell } from "@/components/page-shell";
import { EditProjectForm } from "../edit-project-form";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { ClientRecord, DeliveryEventRecord, ProjectRecord } from "@/lib/types";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const projectId = (await params).id;
  const projects = await supabaseSelect<ProjectRecord>("projects", { id: `eq.${projectId}`, limit: "1" });
  const clients = await supabaseSelect<ClientRecord>("clients", { limit: "500" });
  const deliveryEvents = await supabaseSelect<DeliveryEventRecord>("delivery_events", { project_id: `eq.${projectId}`, limit: "500" });

  const project = projects[0] ?? null;
  const client = project?.client_id ? clients.find((item) => item.id === project.client_id) ?? null : null;

  return (
    <PageShell title={project ? project.name : "Project"} subtitle="Project management and ownership controls.">
      {project ? <EditProjectForm project={project} /> : null}

      {project ? (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-300">Client: {client ? client.name : "Unassigned"}</p>
          <p className="mt-1 text-sm text-slate-300">Status: {project.status}</p>
          <p className="mt-1 text-sm text-slate-300">Keywords: {(project.target_keywords ?? []).join(", ") || "None"}</p>
          <p className="mt-1 text-sm text-cyan-300">Delivery events: {deliveryEvents.length}</p>
        </div>
      ) : null}
    </PageShell>
  );
}
