import { ne, wre, ae, ue, signal, effect } from "r-web/dev/browser";

wre(document.body);

const count = signal(0);

const NewCountElement = (num: number) => ne("p", { id: "c" }, `Count: ${num}`);

const CountElement = NewCountElement(0);

ae(
  document.body,
  ne("p", {}, "Hello, World!"),
  CountElement,
  ne(
    "button",
    {
      events: (event) => {
        if (event.type === "click") {
          count.value = count.value + 1;
        }
      },
    },
    "Click me!"
  )
);

effect(() => {
  console.log(count.value);
  ue(document.getElementById("c")!, NewCountElement(count.value));
  console.log(document.getElementById("c")?.isEqualNode(CountElement));
});
