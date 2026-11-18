import { addTask, removeTask, completeTask, formatTasks } from "./tasks.ts";
import { loadTasks, saveTasks } from "./storage.ts";
import path from "node:path";

const filePath =
  process.env.TODO_FILE ??
  path.join(import.meta.dirname, "..", "output", "tasks.json");

type Command = "add" | "list" | "done" | "remove" | "help";

type CommandInfo = {
  usage: string;
  description: string;
  run: (args: string[]) => Promise<void>;
};

const commands: Record<Command, CommandInfo> = {
  add: {
    usage: 'add "<title>"',
    description: "Add a new task",
    run: async (args) => {
      checkArgCount(
        args,
        1,
        `Put the title in quotes: add "${args.join(" ")}"`,
      );
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
    },
  },
  list: {
    usage: "list",
    description: "Show all tasks",
    run: async (args) => {
      checkArgCount(
        args,
        0,
        `This command does not require any arguments: ${commands.list.usage}`,
      );
      const tasks = await loadTasks(filePath);
      console.log(formatTasks(tasks));
    },
  },
  done: {
    usage: "done <id>",
    description: "Mark a task as done",
    run: async (args) => {
      checkArgCount(
        args,
        1,
        `Leave only one index, for example: done ${args.at(0)}`,
      );
      const id = parseId(args[0]);
      const tasks = completeTask(await loadTasks(filePath), id);
      await saveTasks(filePath, tasks);
      console.log(`Completed task ${id}`);
    },
  },
  remove: {
    usage: "remove <id>",
    description: "Delete the task by ID",
    run: async (args) => {
      checkArgCount(
        args,
        1,
        `Leave only one index, for example: remove ${args.at(0)}`,
      );
      const id = parseId(args[0]);
      const tasks = removeTask(await loadTasks(filePath), id);
      await saveTasks(filePath, tasks);
      console.log(`Removed task ${id}`);
    },
  },
  help: {
    usage: "help",
    description: "Show all available commands",
    run: async (args) => {
      checkArgCount(
        args,
        0,
        `This command does not require any arguments: ${commands.help.usage}`,
      );
      const descriptions = formatHelp();
      console.log(descriptions);
    },
  },
};

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

function checkArgCount(args: string[], maxArgs: number, hint: string): void {
  if (args.length > maxArgs) {
    throw new Error("Too many arguments. " + hint);
  }
}

function isCommand(input: string): input is Command {
  return Object.keys(commands).includes(input);
}

function formatHelp(): string {
  return Object.values(commands)
    .map((commandInfo) => `${commandInfo.usage} - ${commandInfo.description}`)
    .join("\n");
}

async function main(): Promise<void> {
  try {
    const [command, ...args] = process.argv.slice(2);
    if (command === undefined) {
      throw new Error("Command argument missing");
    }
    if (isCommand(command)) {
      await commands[command].run(args);
    } else {
      throw new Error(`Unknown command: ${command}`);
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
