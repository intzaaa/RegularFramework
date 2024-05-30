import { mre, ne, runtime } from "r-web";

mre(document.body);

const helloWorld = ne(
  "a",
  { id: "hello-world", href: new URL("https://example.com").toString() },
  { display: "flex" },
  (type, event) => {
    console.log(type, event);
  },
  "Hello, World!"
);

runtime.rootElement.appendChild(ne("div", undefined, undefined, undefined, helloWorld, ne("br"), "Hello, World!"));
