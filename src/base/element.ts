import type * as CSS from "csstype";
import type { JSDOM } from "jsdom";

import { NewEffect } from "../library/signal";
import { GetValue, StaticFinal, Final, GetFlatValue } from "../library/value";

import diff from "../library/diff";
import { isNotNil } from "ramda";

export type Component = (...parameters: any[]) => Final<Element>;

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
  NewElement: <T extends keyof HTMLElementTagNameMap>(tag: StaticFinal<T>, attributes?: Attributes, ...children: Final<any>[]) => HTMLElementTagNameMap[T];

  SetElementAttribute: <T extends Element>(element: StaticFinal<T>, attributes?: Attributes) => T;

  AddElement: <T extends Element>(parent: StaticFinal<T>, ...children: Final<any>[]) => T;

  // UpdateElement: (target: StaticFinal<Element>, source: StaticFinal<Element>) => Element;

  WatchRootElement: <T extends Element>(rootElement: StaticFinal<T>, callback?: (event: Events) => void) => T;
};

export const GetElementFunctionGroup = (window: Window | JSDOM["window"]) => {
  const _: ElementFunctionGroup = {
    NewElement(tag, attributes, ...children) {
      const element = window.document.createElement(GetValue(tag));

      _.SetElementAttribute(element, attributes);
      _.AddElement(element, ...children);
      return element;
    },

    SetElementAttribute(element, attributes) {
      const _element = GetValue(element);

      NewEffect(() => {
        const _attributes = GetValue(attributes);

        for (const key in _attributes) {
          NewEffect(() => {
            if (!["styles", "events"].includes(key)) _element.setAttribute(key, _attributes[GetValue(key as keyof typeof _attributes)]);
          });
        }

        NewEffect(() => {
          const _styles = GetValue(_attributes?.styles);
          if (_styles) {
            for (const [key, value] of Object.entries(_styles)) {
              NewEffect(() => {
                if (_element instanceof (HTMLElement || SVGElement)) {
                  // @ts-ignore
                  _element.style[key] = value;
                }
              });
            }
          }
        });

        _element.addEventListener("receive", (event) => {
          _attributes?.events?.(
            // @ts-ignore
            event.detail.data
          );
        });
      });

      return _element;
    },

    AddElement(parent, ...children) {
      const _parent = GetValue(parent);

      const createdTime = performance.now() + performance.now();
      const start = window.document.createComment("s-" + createdTime) as Node;
      const end = window.document.createComment("e-" + createdTime) as Node;
      _parent.append(start, end);

      const GetStartIndex = () => Array.from(_parent.childNodes).findIndex((e) => e === start);
      const GetEndIndex = () => Array.from(_parent.childNodes).findIndex((e) => e === end);

      const cache: {
        node: Node[];
        text: { [key: string]: Node };
      } = {
        node: [],
        text: {},
      };

      NewEffect(() => {
        const flatChildren = [
          start,
          ...(GetFlatValue(children)
            .filter((v) => isNotNil(v))
            .map((v, i, a) => {
              if (v instanceof Node) {
                const _node = cache.node.filter((node) => node.isEqualNode(v)).filter((v) => !a.slice(0, i).includes(v))[0];
                if (_node) {
                  // console.info("Use node cache", _node);
                  return _node;
                } else {
                  // console.info("Create node cache", v);
                  cache.node.push(v);
                  return v;
                }
              } else {
                const string = String(v);
                const _node = cache.text[string];
                if (_node) {
                  // console.info("Use text cache", _node);
                  return _node;
                } else {
                  const node = window.document.createTextNode(v);
                  // console.info("Create text cache", node);
                  cache.text[string] = node;
                  return node;
                }
              }
            }) as Node[]),
          end,
        ];

        diff(_parent, Array.from(_parent.childNodes).slice(GetStartIndex(), GetEndIndex() + 1), flatChildren, (node /*, action*/) => {
          // if (action === 1) console.info(action, node);
          return node;
        });

        return () => {
          cache.node = cache.node.filter((node) => flatChildren.includes(node));

          Object.entries(cache.text).forEach(([key, value]) => {
            if (!flatChildren.includes(value)) {
              // console.info("Delete text cache", value);
              delete cache.text[key];
            }
          });
        };
      });
      return _parent;
    },

    // RemoveElement(parent, ...children) {
    //   const _parent = GetValue(parent);
    //   children.forEach((child) => _parent.removeChild(GetValue(child)));
    // },

    // UpdateElement(target, source) {
    //   const _source = GetValue(source);
    //   GetValue(target).replaceWith(_source);
    //   return _source;
    // },

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
    // ue: _.UpdateElement,
    wre: _.WatchRootElement,
  };
};
