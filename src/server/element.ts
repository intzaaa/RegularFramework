/**
 * STILL IN DEVELOPMENT, DO NOT USE!
 */

import { JSDOM } from "jsdom";

import { GetElementFunction } from "../base/element";

export const { NewElement, AddElement, UpdateElement, WatchRootElement } = GetElementFunction(new JSDOM().window);

export { NewElement as ne, AddElement as ae, UpdateElement as ue, WatchRootElement as wre };
