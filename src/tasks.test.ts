import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { addTask, completeTask, removeTask, formatTasks } from "./tasks.ts";

describe("addTask", () => {
  test("adds a task to an empty list", () => {
    assert.equal(addTask([], "Buy milk")[0].id, 1);
  });

  test("uses max id + 1", () => {
    const tasks = [
      { id: 1, title: "Buy bread", done: false },
      { id: 5, title: "Check your email", done: false },
    ];
    assert.equal(addTask(tasks, "Buy eggs")[2].id, 6);
  });

  test("uses max id + 1 when ids are not sorted", () => {
    const tasks = [
      { id: 5, title: "Call Grandma", done: false },
      { id: 1, title: "Do the lab assignment", done: false },
    ];
    assert.equal(addTask(tasks, "Buy eggs")[2].id, 6);
  });

  test("does not mutate the original array", () => {
    const tasks = [
      { id: 1, title: "Feed the cat", done: false },
      { id: 2, title: "Adjust the clock", done: false },
    ];
    addTask(tasks, "Buy bread");
    assert.equal(tasks.length, 2);
  });

  test("trims the title", () => {
    assert.equal(addTask([], " Buy cigarettes ")[0].title, "Buy cigarettes");
  });

  test("throws TypeError for an empty title", () => {
    assert.throws(() => addTask([], ""), TypeError);
    assert.throws(() => addTask([], "   "), TypeError);
  });
});

describe("completeTask", () => {
  test("marks the task as done", () => {
    const tasks = [
      { id: 5, title: "Buy bread", done: false },
      { id: 4, title: "Buy eggs", done: false },
    ];
    const markedTasks = completeTask(tasks, 5);
    assert.equal(markedTasks[0].done, true);
  });

  test("does not change other tasks", () => {
    const tasks = [
      { id: 5, title: "Buy bread", done: false },
      { id: 4, title: "Buy eggs", done: false },
    ];
    const markedTasks = completeTask(tasks, 5);
    assert.equal(markedTasks[1].done, false);
  });

  test("does not mutate the original task", () => {
    const tasks = [
      { id: 5, title: "Buy bread", done: false },
      { id: 4, title: "Buy eggs", done: false },
    ];
    completeTask(tasks, 5);
    assert.equal(tasks[0].done, false);
  });

  test("throws RangeError for an unknown id", () => {
    const tasks = [{ id: 3, title: "Buy bread", done: false }];
    assert.throws(() => completeTask(tasks, 5), RangeError);
  });
});

describe("removeTask", () => {
  test("removes a task from the list by ID", () => {
    const tasks = [
      { id: 4, title: "Call Grandma", done: false },
      { id: 2, title: "Adjust the clock", done: false },
    ];
    assert.deepEqual(removeTask(tasks, 4), [
      { id: 2, title: "Adjust the clock", done: false },
    ]);
  });

  test("returns a new array upon deletion", () => {
    const tasks = [
      { id: 3, title: "Buy bread", done: false },
      { id: 5, title: "Buy eggs", done: false },
    ];
    assert.deepEqual(removeTask(tasks, 5), [
      { id: 3, title: "Buy bread", done: false },
    ]);
    assert.deepEqual(tasks[1], { id: 5, title: "Buy eggs", done: false });
  });

  test("does not mutate the original array", () => {
    const tasks = [
      { id: 1, title: "Do the lab assignment", done: false },
      { id: 3, title: "Buy bread", done: false },
      { id: 2, title: "Adjust the clock", done: false },
    ];
    removeTask(tasks, 3);
    assert.deepEqual(tasks, [
      { id: 1, title: "Do the lab assignment", done: false },
      { id: 3, title: "Buy bread", done: false },
      { id: 2, title: "Adjust the clock", done: false },
    ]);
  });

  test("throws an error if the ID is unknown", () => {
    const tasks = [
      { id: 2, title: "Adjust the clock", done: false },
      { id: 1, title: "Do the lab assignment", done: false },
      { id: 3, title: "Buy bread", done: false },
    ];
    assert.throws(() => removeTask(tasks, 4), RangeError);
  });
});

describe("formatTasks", () => {
  test("formats an undone task", () => {
    assert.equal(
      formatTasks([{ id: 1, title: "Buy salt", done: false }]),
      "[ ] 1. Buy salt",
    );
  });

  test("formats a done task", () => {
    const tasks = [{ id: 2, title: "Take out the trash", done: true }];
    assert.equal(formatTasks(tasks), "[x] 2. Take out the trash");
  });

  test("uses task id, not position", () => {
    const tasks = [
      { id: 5, title: "Take out the trash", done: true },
      { id: 2, title: "Buy salt", done: false },
    ];
    assert.equal(
      formatTasks(tasks),
      `[x] 5. Take out the trash\n[ ] 2. Buy salt`,
    );
  });

  test("joins tasks with newlines", () => {
    const tasks = [
      { id: 2, title: "Buy salt", done: false },
      { id: 5, title: "Take out the trash", done: true },
    ];
    assert.equal(
      formatTasks(tasks),
      "[ ] 2. Buy salt\n[x] 5. Take out the trash",
    );
  });

  test('returns "No tasks" for an empty list', () => {
    assert.equal(formatTasks([]), "No tasks");
  });
});
