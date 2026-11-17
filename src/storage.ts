import fs from "node:fs/promises";
import path from "node:path";
import type { Task } from "./tasks.ts";

export async function loadTasks(filePath: string): Promise<Task[]> {
  let text;
  try {
    text = await fs.readFile(filePath, "utf8");
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
  const tasks = JSON.parse(text);
  if (!Array.isArray(tasks)) {
    throw new TypeError(`Invalid tasks file: ${filePath}`);
  }
  return tasks;
}

export async function saveTasks(
  filePath: string,
  tasks: Task[],
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
}
