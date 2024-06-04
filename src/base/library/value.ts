import { Signal } from "./signal";

export type Final<T> = T | (() => Final<T>) | Signal<T>;

const STOP = Symbol("STOP");

export const StopGetValue = (input: any) => {
  return [STOP, input];
};

/*
export const GetValue = <T>(input: Final<T>): T => {
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
*/

export const GetValue = <T>(input: Final<T>): T => {
  let currentValue: Final<T> = input;

  while (true) {
    if (Array.isArray(currentValue) && currentValue[0] === STOP) {
      return currentValue[1];
    } else if (typeof currentValue === "function") {
      currentValue = (currentValue as () => Final<T>)();
    } else if (currentValue instanceof Signal) {
      currentValue = currentValue.value;
    } else {
      return currentValue;
    }
  }
};

export { GetValue as gvl, StopGetValue as sgv };
