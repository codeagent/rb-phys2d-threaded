[![CI](https://github.com/codeagent/rb-phys2d-threaded/actions/workflows/ci.yml/badge.svg)](https://github.com/codeagent/rb-phys2d-threaded/actions/workflows/ci.yml) [![npm version](https://badge.fury.io/js/rb-phys2d-threaded.svg)](https://badge.fury.io/js/rb-phys2d-threaded)

# Web Worker For RbPhys2D

Package for running [RbPhys2D](https://github.com/codeagent/rb-phys2d) in dedicated WebWorker.

## Limitations

Information regarding to contact between two bodies is not taking into account when listening collision events.

User defined `joints` are also not working.

## Installation

Using `npm` package manager:

```bash
npm install rb-phys2d-threaded
```

## Usage

### ESM

```typescript
import { createWorld } from 'rb-phys2d-threaded';

// Use the synonymous factory
const world = createWorld({ ... });
```

### Browser

```html
<!-- include bundle  -->
<script src="./node_modules/rb-phys2d-threaded/dist/bundle/rb-phys2d-worker-source.js"></script>
<script src="./node_modules/rb-phys2d-threaded/dist/bundle/rb-phys2d-threaded.js"></script>
<script>
  // use global accessible object rbPhys2dThreaded
  const world = rbPhys2dThreaded.createWorld();

  // ...
</script>
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
