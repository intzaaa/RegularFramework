import { JSDOM } from "jsdom";

import { GetVElement } from "../base/element";

export const { NewElement, AddElement, RemoveElement, UpdateElement, WatchRootElement } = GetVElement(new JSDOM().window);

export { NewElement as ne, AddElement as ae, RemoveElement as re, UpdateElement as ue, WatchRootElement as wre };
