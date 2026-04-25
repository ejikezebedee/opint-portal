import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ClientForm } from "./client-form";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { ClientRecord, ProjectRecord } from "@/lib/types";

export default async function AdminClientsPage() {
  const clients = await supabaseSelect<ClientRecord>("clients", { order: "created_at.desc" });
  const projects = await supabaseSelect<ProjectRecord>("projects", { limit: "500" });

  const projectCountByClient = new Map<string, number>();
  for (const project of projects) {
    if (project.client_id) {
      projectCountByClient.set(project.client_id, (projectCountByClient.get(project.client_id) ?? 0) + 1);
    }
  }

  return (
    <PageShell title="Admin Clients" subtitle="Manage client accounts and ownership model.">
      <ClientForm />

      <div className="mt-8 grid gap-4">
        {clients.map((client) => (
          <Link key={client.id} href={`/admin/clients/${client.id}`} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-600">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{client.name}</h2>
                <p className="mt-2 text-sm text-slate-300">{client.company ?? "No company"}</p>
                <p className="mt-1 text-sm text-slate-400">{client.email ?? "No email"}</p>
              </div>
              <div className="rounded-xl border border-cyan-800 px-4 py-3 text-sm text-cyan-300">
                Projects: {projectCountByClient.get(client.id) ?? 0}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
