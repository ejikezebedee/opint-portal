import { supabaseSelect } from "@/lib/supabase-rest";
import { sendProjectDigest } from "@/lib/digest";
import type { DeliveryPreferenceRecord, ProjectRecord } from "@/lib/types";

function shouldRunNow(preference: DeliveryPreferenceRecord, now: Date) {
  const hour = now.getUTCHours();
  if (preference.frequency === "manual") return false;
  if (preference.frequency === "daily") return hour === preference.preferred_hour;
  if (preference.frequency === "weekly") return now.getUTCDay() === 1 && hour === preference.preferred_hour;
  return false;
}

export async function runScheduledDigests(now = new Date()) {
  const preferences = await supabaseSelect<DeliveryPreferenceRecord>("delivery_preferences", { limit: "500" });
  const projects = await supabaseSelect<ProjectRecord>("projects", { limit: "500" });

  const sent: Array<{ client_id: string; project_id: string; result: unknown }> = [];

  for (const preference of preferences) {
    if (!preference.email_enabled || !shouldRunNow(preference, now)) {
      continue;
    }

    const clientProjects = projects.filter((project) => project.client_id === preference.client_id);
    for (const project of clientProjects) {
      const result = await sendProjectDigest(project.id);
      sent.push({ client_id: preference.client_id, project_id: project.id, result });
    }
  }

  return sent;
}
