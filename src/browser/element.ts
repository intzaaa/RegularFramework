import { element } from "../lib/element";

export const { NewElement, WatchEvent, AddElement } = element(globalThis.window);

export { NewElement as NE, WatchEvent as WE, AddElement as AE };
