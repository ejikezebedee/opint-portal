import { NextResponse } from "next/server";
import { sendProjectDigest } from "@/lib/digest";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const projectId = body.projectId;
    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const result = await sendProjectDigest(projectId);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
