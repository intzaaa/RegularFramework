import { NewComputedSignal, NewSignal, ReadonlySignal, Signal } from "./signal";

type ResourceState = "idle" | "loading" | "ready" | "errored";

type Resource<T> = ReadonlySignal<T | undefined> & {
  state: Signal<ResourceState>;
  load: () => void;
};

type FetchParameters = Parameters<typeof fetch>;

export const NewResource = <T = Response>(input: FetchParameters[0], init?: FetchParameters[1], processResponse?: (response: Response) => Promise<T>) => {
  const state = NewSignal<ResourceState>("idle");
  const signal = NewSignal<T | undefined>(undefined);
  const resource = NewComputedSignal(() => signal.value) as Resource<T>;

  const load = async () => {
    state.value = "loading";
    const response = await fetch(input, init);
    if (response.ok) {
      if (processResponse) {
        signal.value = (await processResponse(response)) as T;
      } else {
        signal.value = response as any;
      }
      state.value = "ready";
    } else {
      state.value = "errored";
    }
  };

  resource.state = state;
  resource.load = load;

  return Object.seal(resource);
};

export { NewResource as nr };
