import { NextResponse } from "next/server";
import { supabaseInsert, supabasePatch, supabaseSelect } from "@/lib/supabase-rest";
import type { DeliveryPreferenceRecord } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const params: Record<string, string> = clientId
      ? { client_id: `eq.${clientId}`, limit: "1" }
      : { order: "created_at.desc", limit: "100" };
    const preferences = await supabaseSelect<DeliveryPreferenceRecord>("delivery_preferences", params);
    return NextResponse.json({ preferences });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.client_id) {
      return NextResponse.json({ error: "client_id is required" }, { status: 400 });
    }

    const existing = await supabaseSelect<DeliveryPreferenceRecord>("delivery_preferences", {
      client_id: `eq.${body.client_id}`,
      limit: "1",
    });

    if (existing[0]) {
      const updated = await supabasePatch<DeliveryPreferenceRecord>(
        "delivery_preferences",
        { client_id: `eq.${body.client_id}` },
        {
          frequency: body.frequency ?? existing[0].frequency,
          email_enabled: body.email_enabled ?? existing[0].email_enabled,
          csv_enabled: body.csv_enabled ?? existing[0].csv_enabled,
          preferred_hour: body.preferred_hour ?? existing[0].preferred_hour,
          timezone: body.timezone ?? existing[0].timezone,
          updated_at: new Date().toISOString(),
        },
      );
      return NextResponse.json({ preference: updated[0] });
    }

    const inserted = await supabaseInsert<DeliveryPreferenceRecord>("delivery_preferences", {
      client_id: body.client_id,
      frequency: body.frequency ?? "manual",
      email_enabled: body.email_enabled ?? true,
      csv_enabled: body.csv_enabled ?? true,
      preferred_hour: body.preferred_hour ?? 9,
      timezone: body.timezone ?? "UTC",
    });
    return NextResponse.json({ preference: inserted[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
