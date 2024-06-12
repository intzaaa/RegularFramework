import type { JSDOM } from "jsdom";

import { Final } from "../library/value";
import { NewComputedSignal, NewSignal } from "../library/signal";
import { GetRoute, RouteRegistry, RouteResult } from "../library/router";

import { Events, GetElementFunctionGroup } from "./element";

export type PageData = {
  match: RouteResult<Page>["match"];
  // For future use
};

export type Page = (data: PageData, ...parameters: any[]) => Final<Element>;

export type PageRegistry = RouteRegistry<Page>;

export const PageRouter = (
  window: Window | JSDOM["window"],
  registry: PageRegistry,
  config?: {
    base?: string;
  },
  callback?: (event: Events) => void
) => {
  const { NewElement, AddElement, WatchRootElement } = GetElementFunctionGroup(window);

  const location = NewSignal<URL>(new URL(window.location.href));

  const error = (error: string) =>
    NewElement(
      "p",
      {
        class: "",
        styles: {
          fontWeight: "regular",
          width: "100%",
          height: "100%",
          padding: "1rem",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
      },
      error,
      // TODO: ALLOW SETTING BASE URL
      NewElement("p", {}, NewElement("a", { href: config?.base ?? "/" }, "Go back to Home"))
    );

  let pushStateLock = true;
  const page = NewComputedSignal(() => {
    if (location.value.origin !== window.location.origin) {
      window.location.href = location.value.href;
      return `Redirecting to ${location.value.href}...`;
    } else {
      const route = GetRoute(registry, location.value.pathname.replace(config?.base ?? "", ""));
      if (pushStateLock) {
        pushStateLock = false;
      } else {
        const _location = new URL(location.value.href);
        // _location.pathname = _location.pathname.replace(config?.base ?? "", "");
        window.history.pushState(null, "", _location.href);
      }
      return () => route?.data({ match: route?.match }) ?? error(`Could not find route for ${location.value.pathname}`);
    }
  });

  const element = NewElement("div", {
    styles: {
      display: "contents",
    },
  });

  WatchRootElement(element, (event) => {
    if (event.target instanceof HTMLAnchorElement && event.type === "click") {
      event.preventDefault();
      const url = new URL(event.target.href);
      url.pathname = config?.base ?? "" + url.pathname;
      console.log(url);
      location.value = url;
    }
    callback?.(event);
  });

  window.addEventListener("popstate", () => {
    if (location.value.href !== window.location.href) {
      pushStateLock = true;
      location.value = new URL(window.location.href);
    }
  });

  AddElement(element, page);

  AddElement(window.document.body, element);

  return element;
};
