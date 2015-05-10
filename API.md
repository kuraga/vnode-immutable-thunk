# API

## Types

```
State := Any
VElement := VNode | Widget | VText
Renderer := (state: State) => VElement
VNodeRenderer := (previous: VElement | Thunk) => VElement
equalStatesFn := (first: State, second: State) => Boolean
equalRenderersFn := (first: Renderer, second: Renderer) => Boolean
```

Also consult [virtual-dom](https://github.com/Matt-Esch/virtual-dom).

## `ImmutableThunk`

```javascript
var immutableThunk = ImmutableThunk(renderFn, state[, proto[, equalStates[, equalRenders]]]);
```

or

```javascript
var immutableThunk = new ImmutableThunk(renderFn, state[, proto[, equalStates[, equalRenders]]]);
```

Returns a [`Thunk`](https://github.com/Matt-Esch/virtual-dom/blob/master/docs/thunk.md) which render one time only
and rerender if and only if either `state` changed or `renderFn` changed.

### `renderFn`

```
fn: Renderer
```
Render function, returns a view corresponds `state`.
It should comply [VNode's Thunk Interface (`render` section)]
(https://github.com/Matt-Esch/virtual-dom/blob/master/docs/thunk.md#thunk-interface).

### `state`

```
state: Any
```

Will be given to `renderFn` function.

### `proto`

```
proto: Object | undefined | null
```

Every property of `proto` is set up in `immutableThunk`.
It is neccessary if you want to set [`VNode`'s `key` argument](https://github.com/Matt-Esch/virtual-dom/blob/master/docs/vnode.md#arguments).

Possible values:
* an object,
* `undefined` (default value) means the same as `{}`,
* `null` means the same as `undefined`.

### `equalStates`

```
equalStates: equalStatesFn | undefined | null | true | false
```

States equality function. Returns `true` if `first` is equal to `second` and `false` otherwise.

Possible values:
* a value of type `equalStatesFn`,
* `undefined` (default value) means the same as [`deepEqual`](https://github.com/substack/node-deep-equal)
in `strict` mode:
```javascript
var deepEqual = require('deep-equal');
function defaultEqualStates(first, second) {
    return deepEqual(first, second, { strict: true });
}
```
* `null` means the same as `undefined`,
* `true` means the same as function always return `true`,
* `false` means the same as function always return `false`.

### `equalRenderers`

```
equalRenderers: equalRenderersFn | undefined | null | true | false
```

Renderer equality function. Returns `true` if `first` is equal to `second` and `false` else.

Possible values:
* a value of type `equalRenderersFn`,
* `undefined` (default value) means the same as strict equality:
```javascript
function defaultEqualRenderers(first, second) {
    return first === second;
}
```
* `null` means the same as `undefined`,
* `true` means the same as function always return `true`,
* `false` means the same as function always return `false`.

### Return value

Returns a [`Thunk`](https://github.com/Matt-Esch/virtual-dom/blob/master/docs/thunk.md).

Property `immutableThunk` contains every own property of `proto` argument.

Property `immutableThunk.prototype.type` is equal to string `'Thunk`'.
[virtual-dom](https://github.com/Matt-Esch/virtual-dom) uses it [internally]
(https://github.com/Matt-Esch/virtual-dom/blob/master/docs/thunk.md#thunk-interface).

Property `immutableThunk.prototype.render` is a function type `Renderer`.
[virtual-dom](https://github.com/Matt-Esch/virtual-dom) uses it [internally]
(https://github.com/Matt-Esch/virtual-dom/blob/master/docs/thunk.md#thunk-interface).
It receives `previous` (previous rendered thunk) argument. If:
* either `previous` is `undefined` or `null`
* or `previous.type !== 'Thunk'`
* or `previous`' `state` is not equal to thunk's `state` (compared via `equalStates`)
* or `previous`' `renderFn` is not equal to thunk's `renderFn` (compared via `equalRenderers`)

then result of `renderFn(state)` is returned. Otherwise `previous.vnode` is returned.
(To set `vnode` property you can give it in `proto` argument.)
