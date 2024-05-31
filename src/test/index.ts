import { NewElement } from "r-web/dev/server";

const element = NewElement("a", { id: "hello-world", href: new URL("https://example.com").toString() }, { display: "flex" }, undefined, "Hello, World!");

console.log(element.outerHTML);
