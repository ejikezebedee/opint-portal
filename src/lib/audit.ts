import { supabaseSelect, supabaseInsert } from "@/lib/supabase-rest";
import type { ProjectRecord } from "@/lib/types";

const AUDIT_TABLE = "audit_logs";

export async function logAuditEvent(eventType: string, projectId: string | null, userId: string | null, details: Record<string, unknown>) {
  try {
    await supabaseInsert(AUDIT_TABLE, {
      event_type: eventType,
      project_id: projectId,
      user_id: userId,
      details,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
}

export async function getProjectByUserId(userId: string): Promise<ProjectRecord[]> {
  return supabaseSelect<ProjectRecord>("projects", { user_id: `eq.${userId}` });
}