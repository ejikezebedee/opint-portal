import { NextResponse } from "next/server";
import { runScheduledDigests } from "@/lib/digest-scheduler";

export async function POST() {
  try {
    const sent = await runScheduledDigests();
    return NextResponse.json({ ok: true, sent });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
