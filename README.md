# React Component Updater

This package provides the ability to forcibly re-render a component from anywhere through React hooks.

* No extra files or React components required
* No dependencies but React itself
* Very small bundle size (< 1 kB)

# Usage

## Create the updater

```ts
import createUpdater from 'react-component-updater';

const [useMyComponentUpdater, updateMyComponent] = createUpdater();
```

## Use the updater

```ts
const MyComponent = () => {
	useMyComponentUpdater();

	// ...
};
```

With the above code, whenever `updateMyComponent` is called, `MyComponent` will be re-rendered.

## Update the component

The update function can be called **inside or outside** a React component.

```ts
updateMyComponent();
```
