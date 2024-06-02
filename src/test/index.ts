import { AddElement, NewElement, WatchRootElement } from "r-web/dev/server";
import { pipe, curry, __, forEach } from "ramda";
import { GetValue } from "../base/library/value";

const html = NewElement("html");

WatchRootElement(html);

console.log(
  AddElement(
    html,
    NewElement(
      "body",
      { styles: { color: "red" } },
      NewElement("p", {}, "Hello, World!"),
      NewElement(
        "button",
        {
          events: (event) => {
            if (event.type === "click") alert("Clicked!");
          },
        },
        "Click me!"
      )
    )
  ).outerHTML
);
