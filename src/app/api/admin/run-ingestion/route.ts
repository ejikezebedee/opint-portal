import { NextResponse } from "next/server";
import { runIngestion } from "@/lib/python-worker";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sourceId = body.sourceId;

    if (!sourceId) {
      return NextResponse.json({ error: "sourceId is required" }, { status: 400 });
    }

    const result = await runIngestion(sourceId);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
