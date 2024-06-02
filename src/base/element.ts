import type * as CSS from "csstype";
import { effect } from "./library/signal";
import type { JSDOM } from "jsdom";

import { GetValue, ValueOrFunction } from "./library/value";

type Events = (event: Event | CustomEvent) => void;

type _ = {
  NewElement: <T extends keyof HTMLElementTagNameMap>(
    tag: ValueOrFunction<T>,
    attributes?: ValueOrFunction<
      Partial<{
        [key: string]: ValueOrFunction<any>;
        styles?: ValueOrFunction<CSS.Properties>;
        classes?: ValueOrFunction<string[]>;
        events?: Events;
      }>
    >,
    ...children: ValueOrFunction<string | Element>[]
  ) => Element;
  AddElement: (parent: ValueOrFunction<Element>, ...children: ValueOrFunction<string | Element>[]) => Element;
  RemoveElement: (parent: ValueOrFunction<Element>, ...children: ValueOrFunction<Element>[]) => void;
  UpdateElement: (target: ValueOrFunction<Element>, ...source: ValueOrFunction<string | Element>[]) => void;
  WatchRootElement: (rootElement: ValueOrFunction<Element>) => void;
};

new CustomEvent("receive", {
  detail: {
    type: "receive",
  },
});

export const GetVElement = (window: Window | JSDOM["window"]): _ => {
  const _: _ = {
    NewElement(tag, attributes, ...children) {
      const element = window.document.createElement(GetValue(tag));
      const _attributes = GetValue(attributes);
      for (const key in _attributes) {
        if (!["styles", "classes", "events"].includes(key)) element.setAttribute(key, attributes[GetValue(key)]);
      }
      7;
      Object.assign(element.style, GetValue(_attributes?.styles));
      Object.assign(element.classList, GetValue(_attributes?.classes));
      element.addEventListener("receive", (event: CustomEvent) => {
        if (_attributes.events) _attributes.events(event.detail.data);
      });
      effect(() => {
        _.AddElement(element, ...children);
      });
      return element;
    },
    AddElement(parent, ...children) {
      const _parent = GetValue(parent);
      effect(() => {
        _parent.append(...children.map((c) => GetValue(c)));
      });
      return _parent;
    },
    RemoveElement(parent, ...children) {
      const _parent = GetValue(parent);
      effect(() => {
        children.forEach((child) => _parent.removeChild(GetValue(child)));
      });
    },
    UpdateElement(target, ...source) {
      GetValue(target).replaceWith(...source.map((c) => GetValue(c)));
    },
    WatchRootElement(rootElement) {
      Object.keys(window).forEach((key) => {
        if (key.startsWith("on")) {
          try {
            GetValue(rootElement).addEventListener(key.slice(2), (event) => {
              Object.assign(event.currentTarget, null);
              event.target.dispatchEvent(new CustomEvent("receive", { detail: { data: event } }));
            });
          } catch (error) {}
        }
      });
    },
  };
  return _;
};
