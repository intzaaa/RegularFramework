import { JSDOM } from "jsdom";

import { GetVerbElement } from "../base/element";

export const { NewElement, AddElement, RemoveElement, UpdateElement, WatchRootElement } = GetVerbElement(new JSDOM().window);

export { NewElement as ne, AddElement as ae, RemoveElement as re, UpdateElement as ue, WatchRootElement as wre };
