import type * as CSS from "csstype";
import type { JSDOM } from "jsdom";
import { clone, mergeDeepLeft } from "ramda";

type Attribute<T extends keyof HTMLElementTagNameMap> = {
  [key in keyof HTMLElementTagNameMap[T]]?: HTMLElementTagNameMap[T][key];
};

export const element = (window: Window | JSDOM["window"]) => {
  const AddElement = (parent: HTMLElement, ...child: (string | HTMLElement)[]): void => {
    child.forEach((c) => parent.append(clone(c)));
  };

  const NewElement = <T extends keyof HTMLElementTagNameMap>(
    tag: T,
    attribute?: Attribute<T>,
    style?: CSS.Properties,
    event?: (type: string, event: keyof WindowEventMap) => void,
    ...child: (string | HTMLElement)[]
  ): HTMLElementTagNameMap[T] => {
    const element = window.document.createElement(tag);

    Object.assign(element.style, style);

    if (attribute?.style) Object.assign(attribute.style, mergeDeepLeft(style, attribute.style));
    Object.assign(element, attribute);

    element.addEventListener("receiver", (e) => {
      // @ts-ignore
      if (event) event(e.detail.event.type, e.detail.event);
    });

    AddElement(element, ...child);

    return element;
  };

  const WatchEvent = (rootElement: HTMLElement): void => {
    Object.keys(window).forEach((key) => {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();

        try {
          rootElement.addEventListener(eventType, (event: Event) => {
            event.preventDefault();
            Object.assign(event.currentTarget!, undefined);
            event.target?.dispatchEvent(new CustomEvent("receiver", { detail: { event } }));
          });
        } catch (e) {}
      }
    });
  };

  return { NewElement, WatchEvent, AddElement };
};
