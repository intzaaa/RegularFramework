import { GetVerbElement } from "../base/element";

export type * from "../base/element";

export const { NewElement, AddElement, UpdateElement, WatchRootElement } = GetVerbElement(globalThis.window);

export { NewElement as ne, AddElement as ae, UpdateElement as ue, WatchRootElement as wre };
