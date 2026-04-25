#!/usr/bin/env python3
"""Run scheduled digest execution through the live portal API."""

from __future__ import annotations

import json
import urllib.request


def main() -> int:
    request = urllib.request.Request(
        "http://127.0.0.1:3001/api/admin/delivery/run-scheduled",
        method="POST",
        headers={"Content-Type": "application/json", "Cookie": "opint_portal_session=authenticated"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        body = response.read().decode("utf-8")
        print(body)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
