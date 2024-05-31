import { JSDOM } from "jsdom";

import { element } from "../lib/element";

export const { NewElement, WatchEvent, AddElement } = element(new JSDOM().window);

export { NewElement as NE, WatchEvent as WE, AddElement as AE };
