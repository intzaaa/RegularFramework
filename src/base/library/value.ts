import { Signal } from "./signal";

export type ValueFunctionSignal<T> = T | (() => T) | Signal<T>;

export const GetValue = <T>(input: ValueFunctionSignal<T>): T => {
  if (typeof input === "function") {
    return GetValue((input as () => T)());
  } else if (input instanceof Signal) {
    return input.value;
  } else {
    return input;
  }
};
