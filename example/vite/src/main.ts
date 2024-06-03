import { presetUno } from "unocss/preset-uno";
import initUnocssRuntime from "@unocss/runtime";

import { ne, wre, ae, nsi, GetVerb, Styles } from "regular-framework/dev/browser";

const root = ne("div", {
  styles: {
    display: "contents",
  },
})!;

ae(document.body, root);

initUnocssRuntime({
  defaults: {
    presets: [presetUno],
  },
  autoPrefix: true,
  rootElement: () => root,
});

wre(root);

const count = nsi(0);

const hr = () => ne("hr");

ae(root, ne("h1", {}, "Vite + RegularFramework Example"), hr);

ae(root, ne("h2", {}, "Hello, World!"), hr);

ae(
  root,
  ne("h2", {}, "Counter"),
  ne("p", {}, `Count: `, ne("b", {}, count), () => (count.value % 2 === 0 ? " (even)" : " (odd)")),
  ne(
    "button",
    {
      events(event) {
        if (event.type === "click") {
          count.value = count.value + 1;
        }
      },
    },
    "Click to +1"
  ),
  hr
);

const input = nsi("");

ae(
  root,
  ne("h2", {}, "Input"),
  ne("p", {}, `Value: `, ne("b", {}, input)),
  ne("input", {
    events(event) {
      if (event.type === "input") {
        input.value = (event.target as HTMLInputElement).value;
      }
    },
  }),
  hr
);

const preStyle: Styles = {
  padding: "10px",
  border: "1px solid black",
  width: "200px",
  height: "100px",
  overflowY: "scroll",
};

const async = nsi("Waiting...");

ae(
  root,
  ne("h2", {}, "Async / Fallback"),
  ne("p", {}, "Value: ", ne("pre", { styles: { ...preStyle, width: "400px", height: "200px" } }, async)),
  ne(
    "button",
    {
      events: (event) => {
        if (event.type === "click") {
          async.value = "Loading...";
          const load = async () => {
            const res = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
            if (res.ok) {
              async.value = await res.text();
            } else {
              async.value = "Error!";
            }
          };
          load();
        }
      },
    },
    () => (async.value.split("\n").length < 2 ? "Click to load" : "Click to reload")
  ),
  hr
);

const showP = nsi(false);
const log = nsi<string[]>([]);
const p = ne(
  "p",
  {
    events: (event) => {
      if (event.type === "add") {
        log.value = [...log.value, "added!"];
      }
      if (event.type === "remove") {
        log.value = [...log.value, "removed!"];
      }
    },
  },
  "Just a regular ",
  ne("b", {}, "p"),
  " element."
);

ae(
  root,
  ne("h2", {}, "Lifecycle"),
  ne(
    "pre",
    {
      styles: preStyle,
    },
    () => log.value.join("\n")
  ),
  () => (showP.value ? p : ne("p", {}, "Nothing to show")),
  ne(
    "button",
    {
      events: (event) => {
        if (event.type === "click") {
          showP.value = !showP.value;
        }
      },
    },
    "Click to add / remove"
  ),
  hr
);

const unocss = nsi("bg-red-500 text-white p-2 rounded-md");

ae(
  root,
  ne(
    "h2",
    {
      styles: {
        color: "red",
      },
    },
    "UnoCSS"
  ),
  ne(
    "div",
    {
      class: unocss,
    },
    "Hello, UnoCSS!"
  ),
  ne("textarea", {
    events(event) {
      if (event.type === "add") {
        (event.target as HTMLInputElement).value = unocss.value;
      }
      if (event.type === "input") {
        unocss.value = (event.target as HTMLInputElement).value;
      }
    },
  }),
  hr
);

ae(
  root,
  ne("h2", {}, "List / Table"),
  ne(
    "table",
    {},
    ne("tr", {}, ...Object.keys(GetVerb()[0]).map((verb) => ne("th", {}, verb))),
    ...GetVerb().map((row) =>
      ne(
        "tr",
        {},
        ...Object.values(row).map((value) =>
          ne(
            "td",
            {
              styles: {
                textAlign: "center",
              },
            },
            value
          )
        )
      )
    )
  )
);
