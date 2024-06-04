import { GetElementFunctionGroup } from "./base/element";

export type * from "./base/element";

export const {
  //
  NewElement,
  ne,
  //
  AddElement,
  ae,
  //
  UpdateElement,
  ue,
  //
  WatchRootElement,
  wre,
} = GetElementFunctionGroup(globalThis.window);

export * from "./library";
