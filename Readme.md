# RegularFramework

RegularFramework is a new framework for building web pages that is simple, powerful, and elegant.

## Features

- **Simple**: No magic or complex object-oriented concepts. Easy to understand and get started with, whether you're a developer or a large language model like GPT.
- **Powerful**: Provides a few functions as a starting point, allowing you to build more powerful features without limitations.
- **Elegant**: Carefully designed functions ensure you can accomplish more with less code.

## Installation

```bash
pnpm i regular-framework
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

### 2. `AddElement`: Append the root element(, such as appending to `document.body`)

```ts
AddElement(document.body, root);
```

### 4. Say hello to the world

```ts
AddElement(root, NewElement('h1', {}, 'Hello, world!'));
```

### 5. Do things more quickly with shortcuts

- `AddElement`: `ae`
- `NewElement`: `ne`
- `WatchRootElement`: `wre`
- ...

### 5. `NewSignal`: Bring reactivity to your app

```ts
const signal = NewSignal('Hi!');
AddElement(root, NewElement('h1', {}, signal);
signal.value = 'Bye!';
```

### 6. `Final<T>` & `GetValue`: Understand what makes RegularFramework so powerful

```ts
GetValue(() => () => 'Powerful') === 'Powerful' // true;
GetValue(() => signal) === 'Bye!' // true;
GetValue(114514) === 114514 // true, of course;
```

### 7. Visit the example site

<https://regular-framework.pages.dev>

---

Hope you enjoy using RegularFramework! If you have any questions or suggestions, feel free to open an issue or pull request. Thanks!
