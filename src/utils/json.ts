import { writeFile, mkdir } from "fs/promises";
import { dirname } from "path";

export async function writeJson(
  filePath: string,
  data: unknown,
): Promise<void> {
  const dir = dirname(filePath);

  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    throw new Error(
      `Failed to create directory "${dir}" for "${filePath}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  let json: string;
  try {
    json = JSON.stringify(data, null, 2);
  } catch (error) {
    throw new Error(
      `Failed to serialize JSON for "${filePath}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (json === undefined) {
    throw new Error(
      `Failed to serialize JSON for "${filePath}": result was undefined`,
    );
  }

  try {
    await writeFile(filePath, json, "utf-8");
  } catch (error) {
    throw new Error(
      `Failed to write file "${filePath}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
