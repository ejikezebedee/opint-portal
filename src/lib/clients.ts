import { randomBytes } from "node:crypto";
import { supabaseInsert, supabasePatch, supabaseSelect } from "@/lib/supabase-rest";

export type ClientAccessRecord = {
  id: string;
  project_id: string;
  access_token: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
};

export async function generateClientAccessToken(projectId: string): Promise<string> {
  const token = randomBytes(24).toString("hex");
  await supabaseInsert<ClientAccessRecord>("client_access", {
    project_id: projectId,
    access_token: token,
    is_active: true,
  });
  return token;
}

export async function getClientAccessRecordByToken(token: string): Promise<ClientAccessRecord | null> {
  const rows = await supabaseSelect<ClientAccessRecord>("client_access", {
    access_token: `eq.${token}`,
    is_active: "eq.true",
    limit: "1",
  });
  return rows[0] ?? null;
}

export async function getClientAccessToken(projectId: string): Promise<string> {
  const rows = await supabaseSelect<ClientAccessRecord>("client_access", {
    project_id: `eq.${projectId}`,
    is_active: "eq.true",
    limit: "1",
  });
  if (rows[0]) {
    return rows[0].access_token;
  }
  return generateClientAccessToken(projectId);
}

export async function touchClientAccessToken(token: string) {
  await supabasePatch<ClientAccessRecord>(
    "client_access",
    { access_token: `eq.${token}` },
    { last_used_at: new Date().toISOString() },
  );
}

export async function revokeClientAccessToken(token: string) {
  await supabasePatch<ClientAccessRecord>(
    "client_access",
    { access_token: `eq.${token}` },
    { is_active: false, last_used_at: new Date().toISOString() },
  );
}
