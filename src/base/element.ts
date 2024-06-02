import type * as CSS from "csstype";
import { effect } from "./library/signal";
import type { JSDOM } from "jsdom";

import { GetValue, ValueFunctionSignal } from "./library/value";

type _Event = Event & {
  type: string | "added" | "removed";
};

type Events = (event: _Event) => void;

type _ = {
  NewElement: <T extends keyof HTMLElementTagNameMap>(
    tag: ValueFunctionSignal<T>,
    attributes?: ValueFunctionSignal<
      Partial<{
        [key: string]: ValueFunctionSignal<any>;
        styles?: ValueFunctionSignal<CSS.Properties>;
        classes?: ValueFunctionSignal<string[]>;
        events?: Events;
      }>
    >,
    ...children: ValueFunctionSignal<any>[]
  ) => Element;
  AddElement: (parent: ValueFunctionSignal<Element>, ...children: ValueFunctionSignal<any>[]) => Element;
  RemoveElement: (parent: ValueFunctionSignal<Element>, ...children: ValueFunctionSignal<Element>[]) => void;
  UpdateElement: (target: ValueFunctionSignal<Element>, source: ValueFunctionSignal<Element>) => Element;
  WatchRootElement: (rootElement: ValueFunctionSignal<Element>) => void;
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
            element.childNodes[index]?.replaceWith(GetValue(child));
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
            _parent.childNodes[_index]?.replaceWith(GetValue(child));
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
      const _rootElement = GetValue(rootElement);
      Object.keys(window).forEach((key) => {
        if (key.startsWith("on")) {
          try {
            _rootElement.addEventListener(key.slice(2), (event) => {
              event.target?.dispatchEvent(new CustomEvent("receive", { detail: { data: event } }));
            });
          } catch (error) {}
        }
      });
      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node: Node) => {
            if (node instanceof HTMLElement) {
              node.dispatchEvent(
                new CustomEvent("receive", {
                  detail: {
                    data: {
                      type: "add",
                    },
                  },
                })
              );
            }
          });
          mutation.removedNodes.forEach((node: Node) => {
            if (node instanceof HTMLElement) {
              node.dispatchEvent(
                new CustomEvent("receive", {
                  detail: {
                    data: {
                      type: "remove",
                    },
                  },
                })
              );
            }
          });
        });
      }).observe(_rootElement, {
        childList: true,
        subtree: true,
      });
    },
  };
  return _;
};
