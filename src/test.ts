import { GetRoute, RouteRegistry } from "./base/router";

const registry: RouteRegistry<any> = [];

registry.push({
  path: ["test", [[123]]],
  data: "test",
});

const v = GetRoute(registry, "/test/1sksk/huhhu/mimi/jokok");

console.log(v);
