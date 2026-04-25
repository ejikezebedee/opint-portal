const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const REST_URL = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1`;
const authHeaders = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
} satisfies Record<string, string>;

export async function supabaseSelect<T>(table: string, params: Record<string, string> = {}): Promise<T[]> {
  const query = new URLSearchParams({ select: "*", ...params });
  const response = await fetch(`${REST_URL}/${table}?${query.toString()}`, {
    headers: authHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase select failed for ${table}: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

export async function supabaseInsert<T>(table: string, payload: Record<string, unknown>): Promise<T[]> {
  const response = await fetch(`${REST_URL}/${table}`, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed for ${table}: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

export async function supabasePatch<T>(table: string, filters: Record<string, string>, payload: Record<string, unknown>): Promise<T[]> {
  const query = new URLSearchParams(filters);
  const response = await fetch(`${REST_URL}/${table}?${query.toString()}`, {
    method: "PATCH",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Supabase patch failed for ${table}: ${response.status} ${await response.text()}`);
  }

  return response.json();
}
