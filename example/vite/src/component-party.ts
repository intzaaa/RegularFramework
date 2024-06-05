import { AddElement, NewElement, WatchRootElement } from "regular-framework/dev/client";

import p from "path-browserify";

const modules = import.meta.glob("./**/regularFramework/*.ts", { eager: true });

console.log(modules);

const root = NewElement("div", { styles: { display: "contents" } });

WatchRootElement(root);

AddElement(document.body, root);

Object.entries(modules).forEach(([path, module]) => {
  console.log(path, module);
  const component = (module as any)?.default;
  try {
    if (component && !p.basename(path).endsWith("Button.ts"))
      AddElement(root, NewElement("pre", {}, path.replace("../component-party.dev/content", "")), component, () => NewElement("hr"));
  } catch (error) {
    console.error(error);
  }
});
