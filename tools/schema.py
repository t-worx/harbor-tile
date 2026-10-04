#!/usr/bin/env python3
"""Harbor structured data and answer-engine files, via the schema-markup skill.

Run from the build folder:   python3 tools/schema.py

The facts live in schema.config.json (business, owners, services, service
areas, page extras); FAQ markup is read from the questions visible on each
page, so it can never drift from the text. Every page gets one validated
JSON-LD graph between <!-- schema-markup:jsonld:start/end --> markers, and
robots.txt, llms.txt, llms-full.txt and sitemap.xml are refreshed. A page
whose graph fails validation is left untouched and this script exits 1.

This replaces the old hand-maintained generator (see git history for it).
To add a city page: build it with cities.py, add
  "/service-areas/<slug>/": {"spatialCoverage": "<City>"}
under "pages" in schema.config.json, then run this script.
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILL = os.path.expanduser("~/.claude/skills/schema-markup/scripts")

if not os.path.isdir(SKILL):
    sys.exit("schema-markup skill not installed (~/.claude/skills/schema-markup): structured data NOT applied")

for step in (["inject.py", ROOT], ["aeo.py", ROOT, "all", "--force"]):
    r = subprocess.run([sys.executable, os.path.join(SKILL, step[0])] + step[1:], capture_output=True, text=True)
    out = r.stdout.strip().splitlines()
    print("\n".join(out if r.returncode else out[-1:] if step[0] == "inject.py" else out))
    if r.returncode:
        print(r.stderr)
        sys.exit(f"{step[0]} failed; see above")
