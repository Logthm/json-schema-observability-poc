export interface MetricResult {
  name: string;
  source: string;
  value: number;
  fetchedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MetricsOutput {
  generatedAt: string;
  metrics: MetricResult[];
}
