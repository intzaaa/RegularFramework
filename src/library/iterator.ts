import { GetValue } from "./value";

import type { Final } from "./value";

export function* NewIterator<T extends Array<any>>(iterable: Final<T>): Generator<T> {
  for (const value of GetValue(iterable)) {
    yield value;
  }
}

export { NewIterator as nit };
