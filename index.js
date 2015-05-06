'use strict';

var xtendMutable = require('xtend/mutable');
var deepEqual = require('deep-equal');

function ImmutableThunk(renderFn, state, proto, equalStates, equalRenders) {
    if (!(this instanceof ImmutableThunk)) {
        return new ImmutableThunk(renderFn, state, proto, equalStates, equalRenders);
    }

    var _this = this;

    var proto = proto !== undefined && proto !== null ? proto : {};
    if (Object.prototype.toString.call(proto) !== '[object Object]') {
      throw new TypeError('proto must be an object');
    }
    xtendMutable(this, proto);

    this.renderFn = renderFn;
    this.state = state;
    this.equalStates = equalStates !== undefined && equalStates !== null ? equalStates : defaultEqualStates;
    this.equalRenders = equalRenders !== undefined && equalRenders !== null ? equalRenders : defaultEqualRenders;

    function defaultEqualStates(first, second) {
      return deepEqual(first, second, { strict: true });
    }

    function defaultEqualRenders(first, second) {
      return first === second;
    }
}

ImmutableThunk.prototype.type = 'Thunk';

ImmutableThunk.prototype.render = function render(previous) {
      if (shouldUpdate(this, previous)) {
        return this.renderFn.call(null, this.state);
      } else {
        return previous.vnode;
      }

      function shouldUpdate(current, previous) {
        return current === undefined || current === null
            || previous === undefined || previous === null
            || previous.type !== 'Thunk'
            || !current.equalStates(current.state, previous.state)
            || !current.equalRenders(current.renderFn, previous.renderFn);
      }
};

module.exports = ImmutableThunk;
