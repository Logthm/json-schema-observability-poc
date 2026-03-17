GSoC 2026 Qualification Task: JSON Schema Ecosystem Observability

## Overview

This PoC collects two key metrics about the JSON Schema ecosystem:

1. **npm weekly downloads for ajv**
2. **Count of GitHub repos with json-schema topic**

## Installation

```bash
npm install
```

## Usage

**Without GitHub token**

```bash
npm run dev
```

This will:

1. Fetch metrics from npm and GitHub APIs
2. Save results to `output/metrics.latest.json`
3. Display summary in console

**With GitHub Token**

```bash
export GITHUB_TOKEN=your_github_token
npm run dev
```

GitHub token is optional but recommended to avoid rate limiting.

## Output

For example, results are saved to `output/metrics.latest.json` with this structure:

```json
{
  "generatedAt": "2026-03-14T05:45:46.209Z",
  "metrics": [
    {
      "name": "npm_weekly_downloads_ajv",
      "source": "npm registry API",
      "value": 220210141,
      "fetchedAt": "2026-03-14T05:45:46.121Z",
      "metadata": {
        "package": "ajv",
        "start": "2026-03-06",
        "end": "2026-03-12"
      }
    },
    {
      "name": "github_repos_with_json-schema_topic",
      "source": "GitHub API",
      "value": 2416,
      "fetchedAt": "2026-03-14T05:45:46.209Z",
      "metadata": {
        "topic": "json-schema",
        "authenticated": false,
        "query": "topic:json-schema"
      }
    }
  ]
}
```

## Visualization

```bash
npm run plot
```

This will:

1. Read `output/metrics.latest.json`
2. Plot image to `output/metrics.latest.html`

## Notes

See `docs` folder for part1 and part2 documents.
