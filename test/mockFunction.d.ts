declare function mockFunction<T extends (...args: any[]) => any>(
  impl?: T
): {
  (...args: Parameters<T>): ReturnType<T>;

  times: number;
};

export default mockFunction;
