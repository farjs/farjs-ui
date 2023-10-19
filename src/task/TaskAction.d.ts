import { Task } from "./Task";

export interface TaskAction<T> {
  readonly task: Task<T>;
}
