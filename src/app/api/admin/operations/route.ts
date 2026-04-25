import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { AuditLogRecord, DeliveryEventRecord, ReviewTaskRecord } from "@/lib/types";

const LOG_PATH = "/root/.openclaw/workspace/logs/opint-digest-cron.log";

export async function GET() {
  try {
    const [auditLogs, deliveryEvents, reviewTasks] = await Promise.all([
      supabaseSelect<AuditLogRecord>("audit_logs", { order: "created_at.desc", limit: "50" }),
      supabaseSelect<DeliveryEventRecord>("delivery_events", { order: "created_at.desc", limit: "50" }),
      supabaseSelect<ReviewTaskRecord>("review_tasks", { order: "created_at.desc", limit: "50" }),
    ]);

    let schedulerLog = "";
    try {
      schedulerLog = await fs.readFile(LOG_PATH, "utf-8");
    } catch {
      schedulerLog = "No scheduler log yet.";
    }

    return NextResponse.json({
      auditLogs,
      deliveryEvents,
      reviewTasks,
      schedulerLog: schedulerLog.split("\n").slice(-50).join("\n"),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
