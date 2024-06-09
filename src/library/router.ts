export type RoutePath = (string | [any] | [] | [[any]])[];

export type RouteEntry<T> = {
  path: RoutePath | ((path: string) => boolean);
  data: T;
};

export type RouteRegistry<T> = RouteEntry<T>[];

export type RouteResult<T> = {
  match: {
    [key: string]: string;
  };
  data: T;
};

const GetRoute = <T>(registry: RouteRegistry<T>, input: string): RouteResult<T> | undefined => {
  const _input = input.split("/").filter((v) => v !== "");

  for (const { path, data } of registry) {
    if (typeof path === "function") {
      if (path(input)) {
        return {
          match: {},
          data,
        };
      }
    } else {
      const restIndex = path.findIndex((v) => Array.isArray(v) && Array.isArray(v[0]));
      const hasRest = restIndex !== -1;

      const trimmedRestPath = path.slice(0, hasRest ? restIndex + 1 : undefined);
      const trimmedRestInput = _input.slice(0, hasRest ? restIndex + 1 : undefined);

      if (
        (_input.length === trimmedRestPath.length || restIndex !== -1) &&
        trimmedRestInput.filter((v, i) => path[i] === v || Array.isArray(path[i])).length === trimmedRestInput.length
      ) {
        return {
          match: Object.fromEntries(
            trimmedRestPath
              .map((v, i) => {
                if (Array.isArray(v)) {
                  if (Array.isArray(v[0])) {
                    return [v[0][0], "/" + _input.slice(i).join("/")];
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
  }

  return undefined;
};

export { GetRoute, GetRoute as gr };
