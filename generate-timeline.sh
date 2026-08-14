#!/bin/bash
# Fetches repo metadata + weekly commit activity from GitHub (including private repos)
# and writes timeline.json for the project cards.
#
# Usage: GITHUB_TOKEN=ghp_xxx ./generate-timeline.sh
# Create a token at https://github.com/settings/tokens with "repo" scope.

set -euo pipefail

if [ -z "${GITHUB_TOKEN:-}" ]; then
    echo "Error: GITHUB_TOKEN not set."
    echo "Create one at https://github.com/settings/tokens (needs 'repo' scope)"
    echo "Then run: GITHUB_TOKEN=ghp_xxx ./generate-timeline.sh"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

echo "Fetching repos..."
curl -sf \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/user/repos?per_page=100&sort=created&direction=desc&affiliation=owner" \
    > "$TMP_DIR/repos.json"

REPO_COUNT=$(python3 -c "import json; print(len([r for r in json.load(open('$TMP_DIR/repos.json')) if not r.get('fork')]))")
echo "Found $REPO_COUNT non-fork repos. Fetching commit activity..."

python3 -c "
import json, subprocess, sys, time

with open('$TMP_DIR/repos.json') as f:
    repos = json.load(f)

timeline = []
for r in repos:
    if r.get('fork'):
        continue
    name = r['name']
    owner = r['owner']['login']
    sys.stdout.write(f'  {name}...')
    sys.stdout.flush()

    # Fetch weekly commit activity (last 52 weeks)
    # May return 202 on first request (GitHub is computing stats), so retry once
    weekly = []
    for attempt in range(5):
        result = subprocess.run(
            ['curl', '-s', '-w', '%{http_code}',
             '-H', 'Authorization: token $GITHUB_TOKEN',
             '-H', 'Accept: application/vnd.github+json',
             f'https://api.github.com/repos/{owner}/{name}/stats/commit_activity'],
            capture_output=True, text=True
        )
        body = result.stdout
        # Last 3 chars are the HTTP status code
        status = body[-3:]
        body = body[:-3]
        if status == '200' and body.strip().startswith('['):
            data = json.loads(body)
            weekly = [w['total'] for w in data]
            break
        if status == '202':
            sys.stdout.write(f' (computing, retry {attempt+1})...')
            sys.stdout.flush()
        time.sleep(4)

    print(f' {sum(weekly)} commits over {len(weekly)} weeks')

    timeline.append({
        'name': name,
        'language': r.get('language'),
        'description': r.get('description'),
        'created_at': r['created_at'],
        'pushed_at': r['pushed_at'],
        'is_private': r['private'],
        'weekly_commits': weekly,
    })

timeline.sort(key=lambda x: x['created_at'], reverse=True)

with open('$SCRIPT_DIR/timeline.json', 'w') as f:
    json.dump(timeline, f, indent=2)

print(f'Wrote {len(timeline)} repos to timeline.json')
"
