# vnode-immutable-thunk

An immutable thunk optimization for [virtual-dom](https://github.com/Matt-Esch/virtual-dom).

[![Build Status](https://api.travis-ci.org/kuraga/vnode-immutable-thunk.svg?branch=master)](https://travis-ci.org/kuraga/vnode-immutable-thunk)
[![npm version](https://badge.fury.io/js/vnode-immutable-thunk.svg)](http://badge.fury.io/js/vnode-immutable-thunk)

## Installation

`npm install vnode-immutable-thunk`

## Example

Use `ImmutableThunk` when you want to avoid rerendering subtrees.
`ImmutableThunk` will only reevaluate the subtree if the argument you pass to it change.
This means you should use an immutable data structure.

```javascript
var ImmutableThunk = require('vnode-immutable-thunk');
var h = require('virtual-dom/h');

function render(state) {
  return h('div', [
    ImmutableThunk(header, state.head),
    main(),
    ImmutableThunk(footer, state.foot)
  ]);
}

function header(head) { ... }
function main() { ... }
function footer(foot) { ... }
```

The above example demonstrates how we can only evaluate the `header()` function when `state.head` changes.
The `ImmutableThunk` will internally cache the previous `state.head` and  not re-evaluate the expensive `header()`
function unless the `state.head` state has changed.

## Docs

See [API reference](https://github.com/kuraga/vnode-immutable-thunk/blob/master/API.md).

## Author

Alexander Kurakin <<kuraga333@mail.ru>>

## Inspired by

Inspired by [vdom-thunk](https://github.com/Raynos/vdom-thunk).

## Feedback and contribute

<https://github.com/kuraga/vnode-immutable-thunk/issues>

## License

MIT
