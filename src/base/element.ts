import type * as CSS from "csstype";
import type { JSDOM } from "jsdom";

import { NewEffect } from "./library/signal";
import { GetValue, ValueFunctionSignal } from "./library/value";

type LifecycleEvents = {
  type: "add" | "remove";
  target: Node;
};

type Events = Event | LifecycleEvents;

export type Styles = CSS.Properties;

type _ = {
  NewElement: <T extends keyof HTMLElementTagNameMap>(
    tag: ValueFunctionSignal<T>,
    attributes?: ValueFunctionSignal<
      Partial<{
        [key: string]: ValueFunctionSignal<any>;
        styles?: ValueFunctionSignal<Styles>;
        events?: (events: Events) => void;
      }>
    >,
    ...children: ValueFunctionSignal<any>[]
  ) => Element;
  AddElement: (parent: ValueFunctionSignal<Element>, ...children: ValueFunctionSignal<any>[]) => Element;
  // RemoveElement: (parent: ValueFunctionSignal<Element>, ...children: ValueFunctionSignal<Element>[]) => void;
  UpdateElement: (target: ValueFunctionSignal<Element>, source: ValueFunctionSignal<Element>) => Element;
  WatchRootElement: (rootElement: ValueFunctionSignal<Element>, callback?: (event: Events) => any) => void;
};

export const GetVerbElement = (window: Window | JSDOM["window"]): _ => {
  const _: _ = {
    NewElement(tag, attributes, ...children) {
      const element = window.document.createElement(GetValue(tag));
      const _attributes = GetValue(attributes);

      for (const key in _attributes) {
        NewEffect(() => {
          if (!["styles", "events"].includes(key)) element.setAttribute(key, _attributes[GetValue(key)]);
        });
      }

      NewEffect(() => {
        Object.assign(element.style, GetValue(_attributes?.styles));
      });

      element.addEventListener("receive", (event) => {
        _attributes?.events?.(
          // @ts-ignore
          event.detail.data
        );
      });

      children.forEach((child, index) => {
        NewEffect(() => {
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
      const length = _parent.childNodes.length;
      children.forEach((child, index) => {
        const _index = length + index;
        NewEffect(() => {
          if (_parent.childNodes[_index]) {
            _parent.childNodes[_index]?.replaceWith(GetValue(child));
          } else {
            _parent.append(GetValue(child));
          }
        });
      });
      return _parent;
    },

    // RemoveElement(parent, ...children) {
    //   const _parent = GetValue(parent);
    //   children.forEach((child) => _parent.removeChild(GetValue(child)));
    // },

    UpdateElement(target, source) {
      const _source = GetValue(source);
      GetValue(target).replaceWith(_source);
      return _source;
    },

    WatchRootElement(rootElement, callback) {
      const _rootElement = GetValue(rootElement);
      Object.keys(window).forEach((key) => {
        if (key.startsWith("on")) {
          try {
            _rootElement.addEventListener(key.slice(2), (event) => {
              event.target?.dispatchEvent(new CustomEvent("receive", { detail: { data: event } }));
              callback?.(event);
            });
          } catch (error) {}
        }
      });
      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node: Node) => {
            const data: LifecycleEvents = { type: "add", target: node };
            node.dispatchEvent(
              new CustomEvent("receive", {
                detail: {
                  data: data,
                },
              })
            );
            callback?.(data);
          });
          mutation.removedNodes.forEach((node: Node) => {
            const data: LifecycleEvents = { type: "remove", target: node };
            node.dispatchEvent(
              new CustomEvent("receive", {
                detail: {
                  data: data,
                },
              })
            );
            callback?.(data);
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
