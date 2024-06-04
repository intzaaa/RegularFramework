import { Signal } from "./signal";

export type Final<T> = T | (() => Final<T>) | Signal<T>;

const STOP = Symbol("STOP");

export const StopGetValue = (input: any) => {
  return [STOP, input];
};

export const GetValue = <T>(input: Final<T>): T => {
  try {
    if (Array.isArray(input) && input[0] === STOP) {
      return input[1];
    } else if (typeof input === "function") {
      return GetValue((input as () => T)());
    } else if (input instanceof Signal) {
      return GetValue(input.value);
    } else {
      return input;
    }
  } catch (error) {
    console.error(error);
    return undefined as any;
  }
};

export { GetValue as gvl, StopGetValue as sgv };
