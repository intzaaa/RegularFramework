/**
 * STILL IN DEVELOPMENT, DO NOT USE!
 */

import { JSDOM } from "jsdom";

export const Window = new JSDOM().window;

import { GetElementFunctionGroup } from "./base/element";

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

export * from "./library";
