import { NextResponse } from "next/server";
import { supabasePatch } from "@/lib/supabase-rest";
import type { ReviewTaskRecord } from "@/lib/types";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const status = body.status;

    if (!status || !["approved", "rejected", "needs_edit"].includes(status)) {
      return NextResponse.json({ error: "valid status is required" }, { status: 400 });
    }

    const rows = await supabasePatch<ReviewTaskRecord>(
      "review_tasks",
      { id: `eq.${id}` },
      {
        status,
        reviewer_notes: body.reviewer_notes ?? null,
        decision_reason: body.decision_reason ?? null,
        reviewed_at: new Date().toISOString(),
      },
    );

    return NextResponse.json({ reviewTask: rows[0] ?? null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
