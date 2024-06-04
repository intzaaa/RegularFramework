import { GetValue } from "./value";

import type { StaticFinal } from "./value";

export function* NewIterator<T extends Array<any>>(iterable: StaticFinal<T>): Generator<() => T> {
  for (const value of GetValue(iterable)) {
    yield () => value;
  }
}

export { NewIterator as nit };
