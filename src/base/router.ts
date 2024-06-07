import { Component } from "./element";

export type RoutePath = (string | [any] | [] | [[any]])[];

export type RouteEntry<T> = {
  path: RoutePath;
  data: T;
};

export type RouteRegistry<T> = RouteEntry<T>[];

const DefaultRouteRegistry: RouteRegistry<Component> = [];

const GetRoute = <T>(registry: RouteRegistry<T>, input: string) => {
  const _input = input.split("/").filter((v) => v !== "");

  for (const { path, data } of registry) {
    if (Array.isArray(path.at(-1)) && Array.isArray(path.at(-1)?.[0])) {
    }

    const _ = path.findIndex((v) => Array.isArray(v) && Array.isArray(v[0]));

    const _path = path.slice(0, _ === -1 ? undefined : _ + 1);
    const __input = _input.slice(0, _ === -1 ? undefined : _ + 1);

    if ((_input.length === _path.length || _ !== -1) && __input.filter((v, i) => path[i] === v || Array.isArray(path[i])).length === __input.length) {
      return {
        params: Object.fromEntries(
          _path
            .map((v, i) => {
              if (Array.isArray(v)) {
                if (Array.isArray(v[0])) {
                  return [v[0][0], _input.slice(i)];
                } else {
                  return [v[0], _input[i]];
                }
              } else {
                return undefined;
              }
            })
            .filter((v) => v !== undefined) as [string, string][]
        ),
        data,
      };
    }
  }

  return undefined;
};

export { DefaultRouteRegistry, GetRoute, GetRoute as gr };
