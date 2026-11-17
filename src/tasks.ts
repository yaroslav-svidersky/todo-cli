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
  const completeTaskIndex = tasks.findIndex((task) => task.id === id);
  if (completeTaskIndex === -1) {
    throw new RangeError(`Task ${id} not found`);
  }
  const newList = [...tasks];
  newList[completeTaskIndex] = { ...tasks[completeTaskIndex], done: true };
  return newList;
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
