import { Signal } from "./signal";

export type Final<T> = T | (() => Final<T>) | Signal<T>;

export type StaticFinal<T extends Exclude<any, Signal>> = Final<T>;

const STOP = Symbol("STOP");

export const StopGetValue = <T>(input: T) => {
  return [STOP, input as T];
};

export const GetValue = <T>(input: Final<T>): T => {
  // try {
  if (Array.isArray(input) && input[0] === STOP) {
    return input[1];
  } else if (typeof input === "function") {
    return GetValue((input as () => T)());
  } else if (input instanceof Signal) {
    return GetValue(input.value);
  } else {
    return input;
  }
  // } catch (error) {
  //   console.error(error);
  //   return input as T;
  // }
};

// const isIterable = (value: any): value is Iterable<any> => {
//   return typeof value[Symbol.iterator] === "function";
// };

export const GetFlatValue = <T>(iterable: StaticFinal<Array<T>>) => {
  const result: any[] = [];

  for (const value of GetValue(iterable)) {
    const _value = GetValue(value);
    if (Array.isArray(_value)) {
      result.push(...GetFlatValue(_value));
    } else {
      result.push(_value);
    }
  }

  return result;
};

export { GetValue as gvl, GetFlatValue as gfv, StopGetValue as sgv };
