/**
 * STILL IN DEVELOPMENT, DO NOT USE!
 */

import { JSDOM } from "jsdom";

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
} = GetElementFunctionGroup(new JSDOM().window);

export * from "./library";
