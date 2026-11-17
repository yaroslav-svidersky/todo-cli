import { addTask, removeTask, completeTask, formatTasks } from "./tasks.ts";
import { loadTasks, saveTasks } from "./storage.ts";
import path from "node:path";

const filePath =
  process.env.TODO_FILE ??
  path.join(import.meta.dirname, "..", "output", "tasks.json");

function parseId(arg: string | undefined): number {
  if (arg === undefined) {
    throw new Error("ID not specified");
  }
  const id = Number(arg);
  if (!Number.isInteger(id)) {
    throw new TypeError(`Invalid id: ${arg}`);
  }
  return id;
}

async function main(): Promise<void> {
  try {
    const [command, ...args] = process.argv.slice(2);
    if (command === "list") {
      const tasks = await loadTasks(filePath);
      console.log(formatTasks(tasks));
    } else if (command === "add") {
      const title = args[0];
      if (title === undefined) {
        throw new Error("No task title specified after the add command");
      }
      const tasks = addTask(await loadTasks(filePath), title);
      await saveTasks(filePath, tasks);
      const task = tasks.at(-1);
      if (task === undefined) {
        throw new Error("There are no tasks in the task list");
      }
      console.log(`Added task ${task.id}`);
    } else if (command === "remove") {
      const id = parseId(args[0]);
      const tasks = removeTask(await loadTasks(filePath), id);
      await saveTasks(filePath, tasks);
      console.log(`Removed task ${id}`);
    } else if (command === "done") {
      const id = parseId(args[0]);
      const tasks = completeTask(await loadTasks(filePath), id);
      await saveTasks(filePath, tasks);
      console.log(`Completed task ${id}`);
    } else {
      if (command !== undefined) {
        throw new Error(`Unknown command: ${command}`);
      } else {
        throw new Error("Command argument missing");
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exitCode = 1;
  }
}

main();
