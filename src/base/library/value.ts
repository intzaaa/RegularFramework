import { Signal } from "./signal";

export type ValueFunctionSignal<T> = T | (() => ValueFunctionSignal<T>) | Signal<T>;

const STOP = Symbol("STOP");

export const StopGetValue = (input: any) => {
  return [STOP, input];
};

export const GetValue = <T>(input: ValueFunctionSignal<T>): T => {
  if (Array.isArray(input) && input[0] === STOP) {
    return input[1];
  } else if (typeof input === "function") {
    return GetValue((input as () => T)());
  } else if (input instanceof Signal) {
    return GetValue(input.value);
  } else {
    return input;
  }
};

export { GetValue as gvl, StopGetValue as sgv };
