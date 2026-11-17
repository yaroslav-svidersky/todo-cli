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
