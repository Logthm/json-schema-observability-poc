import { join } from "path";
import { fetchNpmDownloads } from "./metrics/npmDownloads.js";
import { fetchGitHubTopicCount } from "./metrics/githubTopicCount.js";
import { writeJson } from "./utils/json.js";
import { config } from "./config.js";
import type { MetricsOutput, MetricResult } from "./types.js";

async function main() {
  console.log("Fetching metrics...\n");

  const jobs = [
    { name: "weekly npm downloads", promise: fetchNpmDownloads() },
    { name: "GitHub topic count", promise: fetchGitHubTopicCount() },
  ];

  const results = await Promise.allSettled(jobs.map((job) => job.promise));
  const metrics: MetricResult[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    const metricName = jobs[index]?.name ?? `metric ${index}`;

    if (result.status === 'fulfilled') {
      metrics.push(result.value);
    } else {
      const errorMsg = `Failed to fetch ${metricName}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`;
      errors.push(errorMsg);
      console.error(`${errorMsg}`);
    }
  });

  if (metrics.length === 0) {
    throw new Error('All metrics failed to fetch');
  }

  const output: MetricsOutput = {
    generatedAt: new Date().toISOString(),
    metrics,
  };

  const outputPath = join(config.outputDir, config.outputFile);
  await writeJson(outputPath, output);

  console.log("\nMetrics collected successfully:");
  metrics.forEach((m) => {
    console.log(`${m.name}: ${m.value}`);
  });

  if (errors.length > 0) {
    console.log(`\nPartial success: ${metrics.length}/${results.length} metrics collected`);
  }

  console.log(`\nOutput saved to: ${outputPath}`);
}

main().catch((error) => {
  console.error("\nFatal error:");
  console.error(error);
  process.exit(1);
});
