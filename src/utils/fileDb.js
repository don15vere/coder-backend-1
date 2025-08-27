import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readJSON(relPath, fallback = []) {
  const fullPath = path.join(__dirname, "..", relPath);
  try {
    const raw = await fs.readFile(fullPath, "utf-8");
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    if (err.code === "ENOENT") {
      await writeJSON(relPath, fallback);
      return fallback;
    }
    throw err;
  }
}

export async function writeJSON(relPath, data) {
  const fullPath = path.join(__dirname, "..", relPath);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
}