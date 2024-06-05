import { AddElement, NewElement, WatchRootElement } from "regular-framework/dev/client";

const modules = import.meta.glob("./**/regularFramework/*.ts", { eager: true });

console.log(modules);

const root = NewElement("div", { styles: { display: "contents" } });

WatchRootElement(root);

AddElement(document.body, root);

Object.entries(modules).forEach(([path, module]) => {
  console.log(path, module);
  const component = (module as any)?.default;
  try {
    if (component && !path.endsWith("Profile.ts") && !path.endsWith("Button.ts") && !path.includes("render-app"))
      AddElement(root, NewElement("pre", {}, path.replace("./component-party.dev/content", "")), component, () => NewElement("hr"));
  } catch (error) {
    console.error(error);
  }
});
