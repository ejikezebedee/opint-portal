#!/bin/sh
set -eu
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
OUTDIR="/root/.openclaw/workspace/backups/opint/${STAMP}"
mkdir -p "$OUTDIR"
cp /root/.openclaw/workspace/logs/opint-digest-cron.log "$OUTDIR/" 2>/dev/null || true
cp /root/.openclaw/workspace/opint-portal/.env.local "$OUTDIR/.env.local.snapshot" 2>/dev/null || true
printf 'Backup created at %s\n' "$OUTDIR"
