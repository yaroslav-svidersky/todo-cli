import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { addTask } from "./tasks.ts";

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
