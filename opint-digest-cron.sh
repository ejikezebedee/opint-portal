#!/bin/sh
set -eu
cd /root/.openclaw/workspace/opint-portal
/usr/bin/python3 /root/.openclaw/workspace/opint-portal/run_scheduled_digests.py >> /root/.openclaw/workspace/logs/opint-digest-cron.log 2>&1
