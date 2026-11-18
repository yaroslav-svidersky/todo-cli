export type Task = {
  id: number;
  title: string;
  done: boolean;
};

export function addTask(tasks: Task[], title: string): Task[] {
  if (title.trim() === "") {
    throw new TypeError("Title must be a non-empty string");
  }
  const highestID =
    tasks.length === 0 ? 0 : Math.max(...tasks.map((task) => task.id));
  return [...tasks, { id: highestID + 1, title: title.trim(), done: false }];
}

export function completeTask(tasks: Task[], id: number): Task[] {
  if (!tasks.some((task) => task.id === id)) {
    throw new RangeError(`Task ${id} not found`);
  }
  return tasks.map((task) => (task.id === id ? { ...task, done: true } : task));
}

export function removeTask(tasks: Task[], id: number): Task[] {
  if (!tasks.some((task) => task.id === id)) {
    throw new RangeError(`Task ${id} not found`);
  }
  return tasks.filter((task) => task.id !== id);
}

export function formatTasks(tasks: Task[]): string {
  if (tasks.length === 0) {
    return "No tasks";
  }
  const listTitles = tasks
    .map((task) => `${task.done ? "[x]" : "[ ]"} ${task.id}. ${task.title}`)
    .join("\n");
  return listTitles;
}
