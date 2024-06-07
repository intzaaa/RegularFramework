/*
import { presetMini } from "unocss/preset-mini";
import initUnocssRuntime from "@unocss/runtime";
*/

import { ne, wre, ae, ns, Styles, nr } from "regular-framework/dev/client";
import { NewTimer } from "./components/timer";

const root = ne("div", {
  styles: {
    display: "contents",
  },
})!;

ae(document.body, root);

/*
initUnocssRuntime({
  defaults: {
    presets: [presetMini],
  },
  autoPrefix: true,
  rootElement: () => root,
});
*/

wre(root);

const count = ns(0);

const hr = () => ne("hr");

ae(root, ne("h1", {}, "Vite + RegularFramework Example"), hr);

ae(root, ne("h2", {}, "Hello, World!"), hr);

ae(
  root,
  ne("h2", {}, "Counter"),
  () => ne("p", {}, "Count: ", ne("b", {}, count), () => (count.value % 2 === 0 ? " (even)" : " (odd)")),
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

const input = ns("");

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

ae(
  root,
  ne("h2", {}, "Async / Fallback"),
  () => {
    const data = nr<string>("https://www.cloudflare.com/cdn-cgi/trace", {}, async (res) => await res.text());
    return [
      ne("p", {}, "Value: ", ne("pre", { styles: { ...preStyle, width: "400px", height: "200px" } }, data)),
      ne(
        "button",
        {
          events: (event) => {
            if (event.type === "click") {
              data.load();
            }
          },
        },
        () => (data.state.value === "idle" ? "Click to load" : "Click to reload")
      ),
    ];
  },
  hr
);

const ifShowP = ns(false);
const log = ns<string[]>([]);
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
  () => (ifShowP.value ? p : ""),
  ne(
    "button",
    {
      events: (event) => {
        if (event.type === "click") {
          ifShowP.value = !ifShowP.value;
        }
      },
    },
    "Click to add / remove"
  ),
  hr
);

/*
const blur = nsi(0);
setInterval(() => {
  blur.value = 2.5 * Math.random();
}, 1000);
const unocss = nsi("bg-red-600 text-white p-2 m-4 w-48 text-center rounded-md");

ae(
  root,
  ne(
    "h2",
    () => ({
      styles: {
        filter: `blur(${blur.value}px)`,
        transition: "filter 2s",
      },
    }),
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
    styles: {
      width: "400px",
      minHeight: "100px",
    },
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
*/

ae(root, NewTimer(), hr);

/*
const start = ns(0);
const range = 5;
setInterval(() => {
  start.value = start.value + 1;
  if (start.value >= 50 - range) {
    start.value = 0;
  }
}, 30000);

const data = nr(async () => {
  return await import("regular-framework/client").then(({ gvb }) => gvb());
});

data.load();

ae(
  root,
  ne("h2", {}, "List / Table"),
  ne("p", {}, "Using Array as a child of NewElement or AddElement will automatically flatten it."),
  ne(
    "table",
    {
      styles: {
        ...preStyle,
        width: "100%",
        height: "200px",
        overflowY: "scroll",
      },
    },
    () => [
      Object.keys(data.value?.[0] ?? {}).map((key) => ne("th", {}, key)),
      data.state.value === "ready"
        ? data.value?.slice(start.value, start.value + range).map((row) =>
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
        : "Loading...",
    ]
  ),
  hr
);
*/

ae(
  root,
  ne("h2", {}, "Resource"),
  () => {
    const data = nr<{
      results: Array<{
        picture: { thumbnail: string };
        name: { first: string; last: string };
      }>;
    }>(new URL("https://randomuser.me/api/?results=3"), {}, async (res) => await res.json());

    setInterval(data.load, 15000);

    return ne(
      "ul",
      {},
      () => {
        switch (data.state.value) {
          case "loading":
            return ne("p", {}, "Fetching users...");
          case "ready":
            return data.value!.results.map((user: any) =>
              ne("li", {}, ne("img", { src: user.picture.thumbnail }), ne("p", {}, user.name.first, " ", user.name.last))
            );
          case "errored":
            return ne("p", {}, "An error occurred while fetching users");
        }
      },
      ne("p", {}, `State: `, data.state, "!")
    );
  },
  hr
);

ae(
  root,
  ne(
    "a",
    {
      href: "/component-party",
    },
    "Go to component-party example"
  )
);
