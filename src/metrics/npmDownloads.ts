import { fetchJson } from '../utils/http.js';
import type { MetricResult } from '../types.js';

interface NpmDownloadsResponse {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

export async function fetchNpmDownloads(): Promise<MetricResult> {
  const packageName = "ajv";
  const url = `https://api.npmjs.org/downloads/point/last-week/${packageName}`;

  const data = await fetchJson<NpmDownloadsResponse>(url);

  if (typeof data.downloads !== 'number' || data.downloads < 0) {
    throw new Error(`Invalid downloads value from npm API: ${data.downloads}`);
  }

  if (!data.package || !data.start || !data.end) {
    throw new Error('Missing required fields in npm API response');
  }

  return {
    name: `npm_weekly_downloads_${packageName}`,
    source: 'npm registry API',
    value: data.downloads,
    fetchedAt: new Date().toISOString(),
    metadata: {
      package: data.package,
      start: data.start,
      end: data.end
    }
  };
}
