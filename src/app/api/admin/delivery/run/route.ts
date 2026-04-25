import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const WORKER_ROOT = "/root/python-worker";
const PYTHON_BIN = "/root/python-worker/.venv/bin/python3";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const opportunityId = body.opportunityId;

    if (!opportunityId) {
      return NextResponse.json({ error: "opportunityId is required" }, { status: 400 });
    }

    const script = [
      "import sys",
      `sys.path.insert(0, '${WORKER_ROOT}')`,
      "from tasks.delivery_rest import create_delivery_events_rest",
      `print(create_delivery_events_rest('${opportunityId}'))`,
    ].join("; ");

    const { stdout, stderr } = await execFileAsync(PYTHON_BIN, ["-c", script], { cwd: WORKER_ROOT });
    return NextResponse.json({ ok: true, stdout: stdout.trim(), stderr: stderr.trim() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
