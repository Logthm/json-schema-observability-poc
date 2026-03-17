import { fetchJson } from "../utils/http.js";
import type { MetricResult } from "../types.js";
import { config } from "../config.js";

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
}

export async function fetchGitHubTopicCount(): Promise<MetricResult> {
  const topic = "json-schema";

  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.set("q", `topic:${topic}`);
  url.searchParams.set("per_page", "1");

  const headers: Record<string, string> = {
    "X-GitHub-Api-Version": "2026-03-10",
    Accept: "application/vnd.github+json",
  };

  if (config.githubToken) {
    headers["Authorization"] = `token ${config.githubToken}`;
  }

  const data = await fetchJson<GitHubSearchResponse>(url.toString(), headers);

  if (typeof data.total_count !== 'number' || data.total_count < 0) {
    throw new Error(`Invalid total_count value from GitHub API: ${data.total_count}`);
  }

  if (data.incomplete_results) {
    throw new Error(`GitHub search incomplete for topic:${topic}`);
  }

  return {
    name: `github_repos_with_${topic}_topic`,
    source: "GitHub API",
    value: data.total_count,
    fetchedAt: new Date().toISOString(),
    metadata: {
      topic,
      authenticated: !!config.githubToken,
      query: `topic:${topic}`,
    },
  };
}
