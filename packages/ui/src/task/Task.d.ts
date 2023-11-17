export interface Task<T> {
  readonly startTime: number;
  readonly message: string;
  readonly result: Promise<T>;
}
