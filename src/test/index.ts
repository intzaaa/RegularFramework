import { ne } from "r-web";

const element = ne("a", { id: "hello-world", href: new URL("https://example.com").toString() }, { display: "flex" }, undefined, "Hello, World!");

console.log(element.outerHTML);
