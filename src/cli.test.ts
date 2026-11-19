import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { dir } from "node:console";

const run = promisify(execFile);
const cliPath = path.join(import.meta.dirname, "cli.ts");

async function makeTodoFile(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "todo-cli-"));
  return path.join(dir, "tasks.json");
}

describe("cli", () => {
  test("adds a task", async () => {
    const todoFile = await makeTodoFile();
    const { stdout } = await run(
      process.execPath,
      [cliPath, "add", "Buy bread"],
      {
        env: { ...process.env, TODO_FILE: todoFile },
      },
    );
    assert.equal(stdout, "Added task 1\n");
  });

  test("there is an additional item on the list", async () => {
    const todoFile = await makeTodoFile();
    await run(process.execPath, [cliPath, "add", "Buy bread"], {
      env: { ...process.env, TODO_FILE: todoFile },
    });
    const { stdout } = await run(process.execPath, [cliPath, "list"], {
      env: { ...process.env, TODO_FILE: todoFile },
    });
    assert.equal(stdout, "[ ] 1. Buy bread\n");
  });

  test("error for an unknown command", async () => {
    const todoFile = await makeTodoFile();
    await assert.rejects(
      async () => {
        await run(process.execPath, [cliPath, "update"], {
          env: { ...process.env, TODO_FILE: todoFile },
        });
      },
      {
        code: 1,
        stderr: "Unknown command: update\n",
      },
    );
  });

  test("Error for extra arguments to the add command", async () => {
    const todoFile = await makeTodoFile();
    await assert.rejects(
      async () => {
        await run(process.execPath, [cliPath, "add", "Buy", "bread"], {
          env: { ...process.env, TODO_FILE: todoFile },
        });
      },
      {
        code: 1,
        stderr:
          'Too many arguments. Put the title in quotes: add "Buy bread"\n',
      },
    );
  });
});
