// import { Window } from "../util/dom";
import { runtime } from "./store";

import type * as CSS from "csstype";

type Attribute<T extends keyof HTMLElementTagNameMap> = {
  [key in keyof HTMLElementTagNameMap[T]]?: HTMLElementTagNameMap[T][key];
};

const newElement = <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attribute?: Attribute<T>,
  style?: CSS.Properties,
  event?: (type: string, event: keyof WindowEventMap) => void,
  ...child: (string | HTMLElement)[]
): HTMLElementTagNameMap[T] => {
  const element = window.document.createElement(tagName);

  Object.assign(element.style, style);

  for (const key in attribute) {
    element.setAttribute(key, attribute[key] as string);
  }

  child.forEach((c) => element.append(c));

  element.addEventListener("receiver", (e: CustomEvent) => {
    event(e.detail.event.type, e.detail.event);
  });

  return element;
};

const mountRootElement = (element: HTMLElement): void => {
  runtime.rootElement = element;
  Object.keys(window).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      try {
        runtime.rootElement.addEventListener(eventType, (event) => {
          event.preventDefault();
          Object.assign(event.currentTarget, undefined);
          event.target.dispatchEvent(new CustomEvent("receiver", { detail: { event } }));
        });
      } catch (e) {}
    }
  });
};

const mountElement = (parent: HTMLElement, element: HTMLElement): void => {
  parent.appendChild(element);
};

export { newElement, newElement as ne, mountRootElement, mountRootElement as mre, mountElement, mountElement as me };
