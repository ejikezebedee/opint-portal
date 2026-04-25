import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { supabasePatch, supabaseSelect } from "@/lib/supabase-rest";
import type { ClientRecord, DeliveryEventRecord, OpportunityRecord, ProjectRecord } from "@/lib/types";

const execFileAsync = promisify(execFile);
const PYTHON_BIN = "/usr/bin/python3";
const EMAIL_SENDER_SCRIPT = "/root/.openclaw/workspace/scripts/email_sender.py";

function buildDigestText(client: ClientRecord, project: ProjectRecord, opportunities: OpportunityRecord[]) {
  const header = `Hello ${client.name},\n\nHere is your latest opportunity digest for project \"${project.name}\".\n`;
  const lines = opportunities.map((opportunity, index) => {
    return `${index + 1}. ${opportunity.title}\nCompany: ${opportunity.company_name ?? "Unknown"}\nLocation: ${opportunity.location ?? "Unknown"}\nURL: ${opportunity.url ?? "N/A"}\n`;
  });
  const footer = "\nRegards,\nEmeka Korie\nOpenClaw Opportunity Intelligence Platform";
  return [header, ...lines, footer].join("\n");
}

function buildDigestHtml(client: ClientRecord, project: ProjectRecord, opportunities: OpportunityRecord[]) {
  const items = opportunities.map((opportunity) => `
    <li style=\"margin-bottom:16px;\">
      <strong>${opportunity.title}</strong><br/>
      Company: ${opportunity.company_name ?? "Unknown"}<br/>
      Location: ${opportunity.location ?? "Unknown"}<br/>
      URL: ${opportunity.url ? `<a href=\"${opportunity.url}\">Open opportunity</a>` : "N/A"}
    </li>
  `).join("");

  return `
    <html>
      <body style=\"font-family:Arial,sans-serif;line-height:1.6;color:#111827;\">
        <h2>Opportunity Digest</h2>
        <p>Hello ${client.name},</p>
        <p>Here is your latest opportunity digest for project <strong>${project.name}</strong>.</p>
        <ul>${items}</ul>
        <p>Regards,<br/>Emeka Korie<br/>OpenClaw Opportunity Intelligence Platform</p>
      </body>
    </html>
  `;
}

export async function sendProjectDigest(projectId: string) {
  const projects = await supabaseSelect<ProjectRecord>("projects", { id: `eq.${projectId}`, limit: "1" });
  const project = projects[0];
  if (!project) {
    throw new Error("Project not found");
  }
  if (!project.client_id) {
    throw new Error("Project has no client assigned");
  }

  const clients = await supabaseSelect<ClientRecord>("clients", { id: `eq.${project.client_id}`, limit: "1" });
  const client = clients[0];
  if (!client || !client.email) {
    throw new Error("Client email is missing");
  }

  const events = await supabaseSelect<DeliveryEventRecord>("delivery_events", {
    project_id: `eq.${projectId}`,
    order: "created_at.desc",
    limit: "20",
  });

  const opportunities: OpportunityRecord[] = [];
  for (const event of events) {
    const rows = await supabaseSelect<OpportunityRecord>("opportunities", {
      id: `eq.${event.opportunity_id}`,
      limit: "1",
    });
    if (rows[0]) opportunities.push(rows[0]);
  }

  if (opportunities.length === 0) {
    throw new Error("No opportunities available for digest");
  }

  const subject = `Opportunity Digest, ${project.name}`;
  const bodyText = buildDigestText(client, project, opportunities);
  const bodyHtml = buildDigestHtml(client, project, opportunities);

  try {
    const { stdout, stderr } = await execFileAsync(PYTHON_BIN, [EMAIL_SENDER_SCRIPT, client.email, subject, bodyText, bodyHtml]);

    for (const event of events) {
      await supabasePatch<DeliveryEventRecord>(
        "delivery_events",
        { id: `eq.${event.id}` },
        {
          status: "delivered",
          delivered_at: new Date().toISOString(),
          metadata: {
            ...(event.metadata ?? {}),
            digest_sent: true,
            digest_subject: subject,
            digest_recipient: client.email,
          },
        },
      );
    }

    return {
      recipient: client.email,
      subject,
      deliveredCount: events.length,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    };
  } catch (error) {
    for (const event of events) {
      await supabasePatch<DeliveryEventRecord>(
        "delivery_events",
        { id: `eq.${event.id}` },
        {
          status: "failed",
          metadata: {
            ...(event.metadata ?? {}),
            digest_failed: true,
            digest_subject: subject,
            digest_recipient: client.email,
            digest_error: error instanceof Error ? error.message : "Unknown error",
          },
        },
      );
    }
    throw error;
  }
}
