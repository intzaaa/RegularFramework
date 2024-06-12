import { NewElement, PageRegistry, PageRouter } from "regular-framework/dev/client";
import example from "./example";
import cp from "./component-party";

const pageRegistry: PageRegistry = [
  {
    path: [],
    data: () => {
      return NewElement(
        "div",
        {
          class: "font-bold underline",
        },
        NewElement("h1", {}, "RegularFramework"),
        NewElement(
          "ul",
          {},
          [
            NewElement("a", { href: "/dynamic/" + Math.random() }, "Go to Dynamic Route"),
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
  {
    path: ["dynamic", ["id"]],
    data: ({ match }) => {
      return NewElement("div", {}, NewElement("h1", {}, "Dynamic Route"), NewElement("p", {}, `Match: ${JSON.stringify(match)}`));
    },
  },
];

PageRouter(pageRegistry /*, { base: "/regular-framework" }*/);
