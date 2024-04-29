import assert from "node:assert/strict";
import Task from "../../src/task/Task.mjs";
import TaskAction from "../../src/task/TaskAction.mjs";
import TaskReducer from "../../src/task/TaskReducer.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("TaskReducer.test.mjs", () => {
  it("should return task from action if TaskAction", () => {
    //given
    const task = Task("current test task", Promise.resolve());
    const taskAction = TaskAction(Task("new task action", Promise.resolve()));

    //when & then
    assert.deepEqual(TaskReducer(task, taskAction), taskAction.task);
  });

  it("should return current state if any other action", () => {
    //given
    const task = Task("test task", Promise.resolve());

    //when & then
    assert.deepEqual(TaskReducer(undefined, "test_action"), undefined);
    assert.deepEqual(TaskReducer(task, undefined), task);
    assert.deepEqual(TaskReducer(task, "test_action"), task);
  });
});
