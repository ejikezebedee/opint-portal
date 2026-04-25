import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const WORKER_ROOT = "/root/python-worker";
const PYTHON_BIN = "/root/python-worker/.venv/bin/python3";

export async function runIngestion(sourceId: string) {
  const script = [
    "import sys",
    `sys.path.insert(0, '${WORKER_ROOT}')`,
    "from tasks.ingestion_rest import ingest_source_rest",
    `print(ingest_source_rest('${sourceId}'))`,
  ].join("; ");

  const { stdout, stderr } = await execFileAsync(PYTHON_BIN, ["-c", script], {
    cwd: WORKER_ROOT,
  });

  return {
    stdout: stdout.trim(),
    stderr: stderr.trim(),
  };
}
