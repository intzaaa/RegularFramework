export type ValueOrFunction<T> = T | (() => Exclude<T, Function>);

export const GetValue = <T>(input: ValueOrFunction<T>): T => {
  return typeof input === "function" ? GetValue((input as () => T)()) : input;
};
