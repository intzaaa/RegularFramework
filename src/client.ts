export const Window = globalThis.window;

import { GetElementFunctionGroup } from "./base/element";

export type * from "./base/element";

export const {
  //
  NewElement,
  ne,
  //
  SetElementAttribute,
  sea,
  //
  AddElement,
  ae,
  //
  UpdateElement,
  ue,
  //
  WatchRootElement,
  wre,
} = GetElementFunctionGroup(Window);

export * from "./base/page";

import { PageRouter as _PageRouter, PageRegistry } from "./base/page";

export const PageRouter = (registry: PageRegistry, config?: Parameters<typeof _PageRouter>["2"], callback?: Parameters<typeof _PageRouter>["3"]) =>
  _PageRouter(Window, registry, config, callback);

export * from "./library";
