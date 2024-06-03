import { JSDOM } from "jsdom";

import { GetVerbElement } from "../base/element";

export const { NewElement, AddElement, UpdateElement, WatchRootElement } = GetVerbElement(new JSDOM().window);

export { NewElement as ne, AddElement as ae, UpdateElement as ue, WatchRootElement as wre };
