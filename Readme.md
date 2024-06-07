# RegularFramework

> Note 1: This project is still in the early stages of development. APIs may change in the future. Please use with caution.
>
> Note 2: This project is inspired by `Mithril.js`, but it is not a Mithril.js clone.
>
> Note 3: This project was not inspired by `uhtml` at the beginning of its development, and I didn't know about it until later.

**R**egular**F**ramework is a new framework for building web pages that is simple, powerful, and elegant.

## Roadmap

- [x] Element
- [x] Reactivity
- [ ] Router
- [ ] Server side rendering
- [ ] Static site generation

Tasks are listed in order of priority.

## Features

- **Simple**: No magic or complex object-oriented concepts. Easy to understand and get started with, whether you're a developer or a large language model like GPT.
- **Powerful**: Provides a few functions as a starting point, allowing you to build more powerful features without limitations.
- **Elegant**: Carefully designed functions ensure you can accomplish more with less code.

## Installation

```bash
pnpm i regular-framework
```

```ts
import { NewElement /*, ... */ } from 'regular-framework/client';

// or directly from the CDN
import { NewElement /*, ... */ } from 'https://esm.sh/regular-framework/client';
```

## Getting Started

### 1. `NewElement`: Create the root element

```ts
const root = NewElement('div');
```

### 2. `WatchRootElement`: Watch all events on the root element

```ts
WatchRootElement(
  root, 
  // Optional callback
  (e) => {}
);
```

### 3. `AddElement`: Append the root element(, such as appending to `document.body`)

```ts
AddElement(document.body, root);
```

### 4. Say hello to the world

```ts
AddElement(root, NewElement('h1', {}, 'Hello, world!'));
```

### 5. Do things faster with aliases

- `AddElement`: `ae`
- `NewElement`: `ne`
- `WatchRootElement`: `wre`
- ...

But be careful! Aliases are not always a good thing, they may **make your code harder to read**.

### 5. `NewSignal`: Bring reactivity to your app

RegularFramework's reactivity system is based on `@preact/signals-core`.

```ts
const signal = NewSignal('Hi!');

AddElement(root, NewElement('h1', {}, signal));

// or
AddElement(root, NewElement('h1', {}, () => signal.value));

signal.value = 'Bye!';
```

### 6. `Final<T>` & `GetValue`: Understand what makes RegularFramework so powerful

```ts
GetValue(() => () => 'Powerful') === 'Powerful' // true
GetValue(() => signal) === 'Bye!' // true
GetValue(114514) === 114514 // true, of course
```

`GetValue` will recursively evaluate the value until it is no longer a function or a signal. If you notice that the parameter type of the RegularFramework built-in function is `Final<T>`, it means that you can pass a function or a signal to it and it will be updated responsively.

If you want to finally return a function, you should wrap it in `StopGetValue`, otherwise it will be evaluated instead of returned.

### 7. Visit the API and example sites to learn more

- <https://intzaaa.github.io/RegularFramework>

- <https://regular-framework.pages.dev>

The source code of the example site is available at `example/vite`.

---

Hope you enjoy using RegularFramework! If you have any questions or suggestions, feel free to open an issue or pull request. Thanks!
