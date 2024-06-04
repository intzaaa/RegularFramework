import type * as CSS from "csstype";
import type { JSDOM } from "jsdom";

import { NewEffect } from "../library/signal";
import { GetValue, Final } from "../library/value";

type LifecycleEvents = {
  type: "add" | "remove";
  target: Node;
};

export type Events = Event | LifecycleEvents;

export type Styles = CSS.Properties;

export type Attributes = Final<
  Partial<{
    [key: string]: Final<any>;
    styles?: Final<Styles>;
    events?: (events: Events) => void;
  }>
>;

export type ElementFunctionGroup = {
  NewElement: <T extends keyof (HTMLElementTagNameMap & SVGElementTagNameMap)>(tag: Final<T>, attributes?: Attributes, ...children: Final<any>[]) => Element;

  SetElementAttribute: (element: Final<Element>, attributes?: Attributes) => Element;

  AddElement: (parent: Final<Element>, ...children: Final<any>[]) => Element;

  UpdateElement: (target: Final<Element>, source: Final<Element>) => Element;

  WatchRootElement: (rootElement: Final<Element>, callback?: (event: Events) => any) => Element;
};

export const GetElementFunctionGroup = (window: Window | JSDOM["window"]) => {
  const _: ElementFunctionGroup = {
    NewElement(tag, attributes, ...children) {
      const element = window.document.createElement(GetValue(tag));

      _.SetElementAttribute(element, attributes);

      element.append(...new Array(children.length).fill(""));
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

    SetElementAttribute(element, attributes) {
      const _element = GetValue(element);
      const _attributes = GetValue(attributes);

      for (const key in _attributes) {
        NewEffect(() => {
          if (!["styles", "events"].includes(key)) _element.setAttribute(key, _attributes[GetValue(key)]);
        });
      }

      NewEffect(() => {
        const _styles = GetValue(_attributes?.styles);
        if (_element instanceof HTMLElement) Object.assign(_element.style, _styles);
      });

      _element.addEventListener("receive", (event) => {
        _attributes?.events?.(
          // @ts-ignore
          event.detail.data
        );
      });
      return _element;
    },

    AddElement(parent, ...children) {
      const _parent = GetValue(parent);
      const length = _parent.childNodes.length;

      _parent.append(...new Array(children.length).fill(""));
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
          const _key = key.slice(2).toLowerCase();
          try {
            _rootElement.addEventListener(
              _key,
              (event) => {
                event.target?.dispatchEvent(new CustomEvent("receive", { detail: { data: event } }));
                callback?.(event);
              },
              {
                passive: ["wheel", "mousewheel", "touchstart", "touchmove"].includes(_key) ? true : false,
              }
            );
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
      return _rootElement;
    },
  };
  return {
    ..._,
    ne: _.NewElement,
    sea: _.SetElementAttribute,
    ae: _.AddElement,
    ue: _.UpdateElement,
    wre: _.WatchRootElement,
  };
};
