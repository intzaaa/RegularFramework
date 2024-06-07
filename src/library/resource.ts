import { NewComputedSignal, NewSignal, ReadonlySignal, Signal } from "./signal";

type ResourceState = "idle" | "loading" | "ready" | "errored";

type Resource<T> = ReadonlySignal<T | undefined> & {
  state: Signal<ResourceState>;
  load: () => void;
};

type FetchParameters = Parameters<typeof fetch>;

function NewResource<T>(func: () => Promise<T>): Resource<T>;
function NewResource<T = Response>(input: FetchParameters[0], init?: FetchParameters[1], processResponse?: (response: Response) => Promise<T>): Resource<T>;

function NewResource<T = Response>(
  input: FetchParameters[0] | (() => Promise<T>),
  init?: FetchParameters[1],
  processResponse?: (response: Response) => Promise<T>
) {
  const _state = NewSignal<ResourceState>("idle");
  const state = NewComputedSignal(() => _state.value);

  const _resource = NewSignal<T | undefined>(undefined);
  const resource = NewComputedSignal(() => _resource.value) as Resource<T>;

  const load = async () => {
    _state.value = "loading";
    if (typeof input === "function") {
      try {
        _resource.value = await input();
        _state.value = "ready";
      } catch (error) {
        _state.value = "errored";
      }
    } else {
      const response = await fetch(input, init);
      if (response.ok) {
        if (processResponse) {
          _resource.value = (await processResponse(response)) as T;
        } else {
          _resource.value = response as any;
        }
        _state.value = "ready";
      } else {
        _state.value = "errored";
      }
    }
  };

  resource.state = state;
  resource.load = load;

  return Object.seal(resource);
}

export { NewResource, NewResource as nr };
