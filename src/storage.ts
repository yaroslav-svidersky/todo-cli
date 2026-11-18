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
  const tasks: unknown = JSON.parse(text);
  if (!Array.isArray(tasks)) {
    throw new TypeError(`Invalid tasks file: ${filePath}`);
  }
  return tasks.map((task) => parseTask(task));
}

export async function saveTasks(
  filePath: string,
  tasks: Task[],
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
}

function parseTask(data: unknown): Task {
  if (typeof data !== "object" || data === null) {
    throw new TypeError("Task must be an object");
  }
  if (!("id" in data) || typeof data.id !== "number") {
    throw new TypeError("Task id must be a number");
  }
  if (
    !("title" in data) ||
    typeof data.title !== "string" ||
    data.title.trim() === ""
  ) {
    throw new TypeError("Task title must be a non-empty string");
  }
  if (!("done" in data) || typeof data.done !== "boolean") {
    throw new TypeError("Task status(done property) must be a boolean value");
  }
  return { id: data.id, title: data.title, done: data.done };
}
