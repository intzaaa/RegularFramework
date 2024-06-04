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

export type ElementFunction = {
  /**
   * Creates a new HTML element with the specified tag name, attributes, and children.
   *
   * @param tag - The tag name of the element.
   * @param attributes - Optional attributes to be applied to the element.
   * @param children - Optional children elements to be appended to the element.
   * @returns The created element.
   */
  NewElement: <T extends keyof HTMLElementTagNameMap>(
    tag: Final<T>,
    attributes?: Final<
      Partial<{
        [key: string]: Final<any>;
        styles?: Final<Styles>;
        events?: (events: Events) => void;
      }>
    >,
    ...children: Final<any>[]
  ) => Element;

  /**
   * Adds the specified children elements to the parent element.
   *
   * @param parent - The parent element to which the children elements will be added.
   * @param children - The children elements to be added.
   * @returns The parent element.
   */
  AddElement: (parent: Final<Element>, ...children: Final<any>[]) => Element;

  // RemoveElement: (parent: ValueFunctionSignal<Element>, ...children: ValueFunctionSignal<Element>[]) => void;

  /**
   * Updates the target element with the properties and attributes of the source element.
   *
   * @param target - The element to be updated.
   * @param source - The element from which the properties and attributes will be copied.
   * @returns The updated element.
   */
  UpdateElement: (target: Final<Element>, source: Final<Element>) => Element;

  /**
   * Watches for changes in the root element and triggers a callback function when an event occurs.
   *
   * @param rootElement - The root element to watch for changes.
   * @param callback - Optional callback function to be triggered when an event occurs.
   */
  WatchRootElement: (rootElement: Final<Element>, callback?: (event: Events) => any) => void;
};

export const GetElementFunction = (window: Window | JSDOM["window"]) => {
  const _: ElementFunction = {
    NewElement(tag, attributes, ...children) {
      const element = window.document.createElement(GetValue(tag));
      const _attributes = GetValue(attributes);

      for (const key in _attributes) {
        NewEffect(() => {
          if (!["styles", "events"].includes(key)) element.setAttribute(key, _attributes[GetValue(key)]);
        });
      }

      NewEffect(() => {
        const _styles = GetValue(_attributes?.styles);
        Object.assign(element.style, _styles);
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
    },
  };
  return {
    ..._,
    ne: _.NewElement,
    ae: _.AddElement,
    ue: _.UpdateElement,
    wre: _.WatchRootElement,
  };
};
