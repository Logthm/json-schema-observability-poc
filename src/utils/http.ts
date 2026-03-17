export async function fetchJson<T>(
  url: string,
  headers: Record<string, string> = {},
  timeoutMs = 10000,
  maxRetries = 2,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");

        const retryableStatus = [429, 502, 503, 504].includes(response.status);

        if (retryableStatus && attempt < maxRetries) {
          const retryAfter = response.headers.get("retry-after");
          const delayMs = retryAfter
            ? Number(retryAfter) * 1000
            : 500 * Math.pow(2, attempt);

          await sleep(delayMs);
          continue;
        }

        throw new Error(
          `HTTP ${response.status} ${response.statusText} for ${url}${
            errorBody ? `: ${errorBody}` : ""
          }`,
        );
      }

      try {
        return (await response.json()) as T;
      } catch (error) {
        throw new Error(
          `Failed to parse JSON response from ${url}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      const isTimeout = error instanceof Error && error.name === "AbortError";

      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof Error && error.message.includes("fetch"));

      const retryableError = isTimeout || isNetworkError;

      if (retryableError && attempt < maxRetries) {
        const delayMs = 500 * Math.pow(2, attempt);
        await sleep(delayMs);
        continue;
      }

      if (isTimeout) {
        throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(`Request failed for ${url}: ${String(error)}`);
    }
  }

  throw new Error(
    `Request failed after ${maxRetries + 1} attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
