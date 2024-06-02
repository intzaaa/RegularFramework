import type * as CSS from "csstype";
import { effect } from "./library/signal";
import type { JSDOM } from "jsdom";

import { GetValue, ValueOrFunction } from "./library/value";

type Events = (event: Event) => void;

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
  UpdateElement: (target: ValueOrFunction<Element>, source: ValueOrFunction<Element>) => Element;
  WatchRootElement: (rootElement: ValueOrFunction<Element>) => void;
};

// new CustomEvent("receive", {
//   detail: {
//     type: "receive",
//   },
// });

export const GetVerbElement = (window: Window | JSDOM["window"]): _ => {
  const _: _ = {
    NewElement(tag, attributes, ...children) {
      const element = window.document.createElement(GetValue(tag));
      const _attributes = GetValue(attributes);

      for (const key in _attributes) {
        if (!["styles", "classes", "events"].includes(key)) element.setAttribute(key, _attributes[GetValue(key)]);
      }

      Object.assign(element.style, GetValue(_attributes?.styles));
      Object.assign(element.classList, GetValue(_attributes?.classes));

      element.addEventListener("receive", (event) => {
        // @ts-ignore
        if (_attributes?.events) _attributes.events(event.detail.data);
      });

      children.forEach((child, index) => {
        effect(() => {
          if (element.childNodes[index]) {
            element.childNodes[index].replaceWith(GetValue(child));
          } else {
            element.append(GetValue(child));
          }
        });
      });
      return element;
    },

    AddElement(parent, ...children) {
      const _parent = GetValue(parent);
      children.forEach((child, index) => {
        effect(() => {
          const _index = _parent.childNodes.length + index;
          if (_parent.childNodes[_index]) {
            _parent.childNodes[_index].replaceWith(GetValue(child));
          } else {
            _parent.append(GetValue(child));
          }
        });
      });
      return _parent;
    },
    RemoveElement(parent, ...children) {
      const _parent = GetValue(parent);
      children.forEach((child) => _parent.removeChild(GetValue(child)));
    },
    UpdateElement(target, source) {
      const _source = GetValue(source);
      GetValue(target).replaceWith(_source);
      return _source;
    },
    WatchRootElement(rootElement) {
      Object.keys(window).forEach((key) => {
        if (key.startsWith("on")) {
          try {
            GetValue(rootElement).addEventListener(key.slice(2), (event) => {
              event.target?.dispatchEvent(new CustomEvent("receive", { detail: { data: event } }));
            });
          } catch (error) {}
        }
      });
    },
  };
  return _;
};
