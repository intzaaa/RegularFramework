import { ne, wre, ae, signal, effect, GetVerb } from "r-web/dev/browser";

wre(document.body);

const count = signal(0);

const hr = () => ne("hr");

ae(document.body, ne("h1", {}, "Vite + R-Web Example"), hr);

ae(document.body, ne("h2", {}, "Hello, World!"), hr);

ae(
  document.body,
  ne("h2", {}, "Counter"),
  ne("p", {}, `Count: `, ne("b", {}, count), () => (count.value % 2 === 0 ? " (even)" : " (odd)")),
  ne(
    "button",
    {
      events: (event) => {
        if (event.type === "click") {
          count.value = count.value + 1;
        }
      },
    },
    "Click to +1"
  ),
  hr
);

const input = signal("");

ae(
  document.body,
  ne("h2", {}, "Input"),
  ne("p", {}, `Value: `, ne("b", {}, input)),
  ne("input", {
    events: (event) => {
      if (event.type === "input") {
        input.value = (event.target as HTMLInputElement).value;
      }
    },
  }),
  hr
);

const async = signal("Waiting...");

ae(
  document.body,
  ne("h2", {}, "Async / Fallback"),
  ne("p", {}, "Value: ", ne("pre", {}, async)),
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

ae(
  document.body,
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

effect(() => {
  console.log(count.value);
});
