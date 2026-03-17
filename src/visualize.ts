import * as fs from "fs";
import * as path from "path";

interface Metric {
  name: string;
  source: string;
  value: number;
  fetchedAt: string;
  metadata: Record<string, any>;
}

interface MetricsData {
  generatedAt: string;
  metrics: Metric[];
}

function generateHTML(data: MetricsData): string {
  const npmMetric = data.metrics.find(
    (m) => m.name === "npm_weekly_downloads_ajv",
  );
  const githubMetric = data.metrics.find(
    (m) => m.name === "github_repos_with_json-schema_topic",
  );

  if (!npmMetric || !githubMetric) {
    throw new Error("Required metrics not found in data");
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON Schema Ecosystem Metrics</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 10px;
        }
        .timestamp {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }
        .chart-container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .chart-wrapper {
            position: relative;
            height: 300px;
        }
        .metric-info {
            margin-top: 15px;
            padding: 10px;
            background: #f9fafb;
            border-radius: 4px;
            font-size: 13px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>JSON Schema Ecosystem Metrics</h1>
    <div class="timestamp">Generated: ${new Date(data.generatedAt).toLocaleString()}</div>

    <div class="chart-container">
        <h2>NPM Weekly Downloads (ajv)</h2>
        <div class="chart-wrapper">
            <canvas id="npmChart"></canvas>
        </div>
        <div class="metric-info">
            <strong>Source:</strong> ${npmMetric.source}<br>
            <strong>Period:</strong> ${npmMetric.metadata.start} to ${npmMetric.metadata.end}<br>
            <strong>Value:</strong> ${npmMetric.value.toLocaleString()} downloads
        </div>
    </div>

    <div class="chart-container">
        <h2>GitHub Repositories with json-schema Topic</h2>
        <div class="chart-wrapper">
            <canvas id="githubChart"></canvas>
        </div>
        <div class="metric-info">
            <strong>Source:</strong> ${githubMetric.source}<br>
            <strong>Topic:</strong> ${githubMetric.metadata.topic}<br>
            <strong>Value:</strong> ${githubMetric.value.toLocaleString()} repositories
        </div>
    </div>

    <script>
        const metricsData = ${JSON.stringify(data)};
        const npmMetric = metricsData.metrics.find(m => m.name === 'npm_weekly_downloads_ajv');
        const githubMetric = metricsData.metrics.find(m => m.name === 'github_repos_with_json-schema_topic');

        // NPM Downloads Chart
        const npmCtx = document.getElementById('npmChart').getContext('2d');
        new Chart(npmCtx, {
            type: 'bar',
            data: {
                labels: ['Weekly Downloads'],
                datasets: [{
                    label: 'ajv package',
                    data: [npmMetric.value],
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // GitHub Repos Chart
        const githubCtx = document.getElementById('githubChart').getContext('2d');
        new Chart(githubCtx, {
            type: 'bar',
            data: {
                labels: ['Repository Count'],
                datasets: [{
                    label: 'json-schema topic',
                    data: [githubMetric.value],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>`;
}

async function main() {
  const metricsPath = path.join(process.cwd(), "output", "metrics.latest.json");
  const outputPath = path.join(process.cwd(), "output", "metrics.latest.html");

  try {
    const rawData = fs.readFileSync(metricsPath, "utf-8");
    const data: MetricsData = JSON.parse(rawData);

    const html = generateHTML(data);

    fs.writeFileSync(outputPath, html, "utf-8");

    console.log("Visualization generated successfully");
    console.log(`Output: ${outputPath}`);
    console.log(`Metrics: ${data.metrics.length} items`);
    console.log(`Generated at: ${new Date(data.generatedAt).toLocaleString()}`);
  } catch (error) {
    console.error("Error generating visualization:", error);
    process.exit(1);
  }
}

main();
