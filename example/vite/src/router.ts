import { NewElement, PageRouter } from "regular-framework/dev/client";
import example from "./example";
import cp from "./component-party";

PageRouter([
  {
    path: [],
    data: () => {
      return NewElement(
        "div",
        {},
        NewElement("h1", {}, "RegularFramework"),
        NewElement(
          "ul",
          {},
          [
            NewElement("a", { href: Math.random() }, "Go to Random Error Fallback Page"),
            NewElement("a", { href: "/example" }, "Go to Example Page"),
            NewElement("a", { href: "/component-party" }, "Go to Component Party"),
          ].map((e) => NewElement("li", {}, e))
        )
      );
    },
  },
  {
    path: ["example"],
    data: example,
  },
  {
    path: ["component-party"],
    data: cp,
  },
]);
