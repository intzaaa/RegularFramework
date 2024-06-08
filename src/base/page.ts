import type { JSDOM } from "jsdom";

import { NewComputedSignal, NewSignal } from "../library/signal";
import { GetRoute, RouteRegistry } from "../library/router";

import { Component, Events, GetElementFunctionGroup } from "./element";
import { AddElement } from "../client";

export type PageRegistry = RouteRegistry<Component>;

export const PageRouter = async (window: Window | JSDOM["window"], registry: PageRegistry, callback?: (event: Events) => void) => {
  const { NewElement, WatchRootElement } = GetElementFunctionGroup(window);

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
      NewElement("p", {}, NewElement("a", { href: "/" }, "Go to Home"))
    );

  let pushStateLock = true;
  const page = NewComputedSignal(() => {
    if (location.value.origin !== window.location.origin) {
      window.location.href = location.value.href;
      return "Redirecting...";
    } else {
      const route = GetRoute(registry, location.value.pathname);
      if (pushStateLock) {
        pushStateLock = false;
      } else {
        window.history.pushState(null, "", location.value.href);
      }
      return route?.data ?? error(`Could not find route for ${location.value.pathname}`);
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
      location.value = new URL(event.target.href);
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
