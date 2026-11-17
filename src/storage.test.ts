import { describe, test } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import fs from "node:fs/promises";
import path from "node:path";
import type { Task } from "./tasks.ts";
import { loadTasks, saveTasks } from "./storage.ts";

describe("loadTasks&saveTasks", () => {
  test("returns an empty array when the file does not exist", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "todo-"));
    const result = await loadTasks(path.join(dir, "tasks.json"));
    assert.deepEqual(result, []);
  });

  test("saves and loads tasks", async () => {
    const tasks = [{ id: 3, title: "Buy bread", done: false }];
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "todo-"));
    const filePath = path.join(dir, "tasks.json");
    await saveTasks(filePath, tasks);
    const result = await loadTasks(filePath);
    assert.deepEqual(result, tasks);
  });

  test("creates missing directories on save", async () => {
    const tasks = [{ id: 5, title: "Wash the dishes", done: true }];
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "todo-"));
    const filePath = path.join(dir, "a", "b", "tasks.json");
    await saveTasks(filePath, tasks);
    const result = await loadTasks(filePath);
    assert.deepEqual(result, tasks);
  });

  test("rejects with TypeError when the file is not an array", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "todo-"));
    const filePath = path.join(dir, "tasks.json");
    await fs.writeFile(filePath, '{"a":1}');
    await assert.rejects(() => loadTasks(filePath), {
      name: "TypeError",
      message: `Invalid tasks file: ${filePath}`,
    });
  });
});
