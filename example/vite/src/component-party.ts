import { AddElement, NewElement } from "regular-framework/dev/client";

const modules = import.meta.glob("./**/regularFramework/*.ts");

const root = () => {
  const root = NewElement("div", { styles: { display: "contents" } });

  (async () => {
    for (const [path, module] of Object.entries(modules)) {
      try {
        if (!path.endsWith("Profile.ts") && !path.endsWith("Button.ts") && !path.includes("render-app")) {
          const component = ((await module()) as any)?.default;
          AddElement(root, NewElement("pre", {}, path.replace("./component-party.dev/content", "")), component, () => NewElement("hr"));
        }
      } catch (error) {
        console.log(path, module, error);
      }
    }
  })();

  return root;
};

export default root;
