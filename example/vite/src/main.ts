import { NewElement, NE, WatchEvent, AddElement } from "r-web/dev/browser";

const root = document.getElementById("app")!;

WatchEvent(root);

const helloWorld = NewElement(
  "a",
  { id: "hello-world", href: new URL("https://example.com").toString(), className: "Hello" },
  { display: "static" },
  (type, event) => {
    console.log(type, event);
  },
  "Hello, World!"
);

AddElement(root, helloWorld);

AddElement(helloWorld, NE("br"), NE("span", { className: "World" }, { display: "flex" }, undefined, "Hello, World, Again!"));
