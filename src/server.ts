/**
 * STILL IN DEVELOPMENT, DO NOT USE!
 */

import { JSDOM } from "jsdom";

import { GetElementFunction } from "./base/element";

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
} = GetElementFunction(new JSDOM().window);

export * from "./base/library";
