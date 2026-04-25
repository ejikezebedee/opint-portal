import { PageShell } from "@/components/page-shell";

async function getOperations() {
  const response = await fetch("http://127.0.0.1:3001/api/admin/operations", { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

export default async function AdminOperationsPage() {
  const data = await getOperations();
  const auditLogs = data?.auditLogs ?? [];
  const deliveryEvents = data?.deliveryEvents ?? [];
  const reviewTasks = data?.reviewTasks ?? [];
  const schedulerLog = data?.schedulerLog ?? "No scheduler log available.";

  return (
    <PageShell title="Operations" subtitle="Audit visibility, recent delivery outcomes, and scheduler health.">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Audit Log</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {auditLogs.length === 0 ? (
              <p className="text-slate-400">No audit events yet.</p>
            ) : (
              auditLogs.map((log: { id: string; event_type: string; created_at: string }) => (
                <div key={log.id} className="rounded-xl border border-slate-800 px-4 py-3">
                  <p className="font-medium">{log.event_type}</p>
                  <p className="text-slate-400">{new Date(log.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Recent Delivery Events</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {deliveryEvents.length === 0 ? (
              <p className="text-slate-400">No delivery events yet.</p>
            ) : (
              deliveryEvents.map((event: { id: string; status: string; project_id: string; delivered_at: string | null }) => (
                <div key={event.id} className="rounded-xl border border-slate-800 px-4 py-3">
                  <p className="font-medium">{event.status}</p>
                  <p className="text-slate-400">Project: {event.project_id}</p>
                  <p className="text-slate-500">Delivered: {event.delivered_at ?? "Pending"}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 xl:col-span-2">
          <h2 className="text-xl font-semibold">Scheduler Log</h2>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300 whitespace-pre-wrap">
            {schedulerLog}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 xl:col-span-2">
          <h2 className="text-xl font-semibold">Recent Review Activity</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {reviewTasks.length === 0 ? (
              <p className="text-slate-400">No review activity yet.</p>
            ) : (
              reviewTasks.map((task: { id: string; status: string; opportunity_id: string; created_at: string }) => (
                <div key={task.id} className="rounded-xl border border-slate-800 px-4 py-3">
                  <p className="font-medium">{task.status}</p>
                  <p className="text-slate-400">Opportunity: {task.opportunity_id}</p>
                  <p className="text-slate-500">Created: {new Date(task.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
