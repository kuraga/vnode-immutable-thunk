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

    if (equalStates === undefined || equalStates === null) {
        this.equalStates = defaultEqualStates;
    } else if (equalStates === true) {
        this.equalStates = justTrue;
    } else if (equalStates === false) {
        this.equalStates = justFalse;
    } else {
        this.equalStates = equalStates;
    }

    if (equalRenders === undefined || equalRenders === null) {
        this.equalRenders = defaultEqualRenders;
    } else if (equalRenders === true) {
        this.equalRenders = justTrue;
    } else if (equalRenders === false) {
        this.equalRenders = justFalse;
    } else {
        this.equalRenders = equalRenders;
    }
}

ImmutableThunk.prototype.type = 'Thunk';

ImmutableThunk.prototype.render = function render(previous) {
    if (shouldUpdate(this, previous)) {
        return this.renderFn.call(null, this.state);
    } else {
        return previous.vnode;
    }
};

function defaultEqualStates(first, second) {
    return deepEqual(first, second, { strict: true });
}

function defaultEqualRenders(first, second) {
    return first === second;
}

function justTrue() {
    return true;
}

function justFalse() {
    return false;
}

function shouldUpdate(current, previous) {
   return current === undefined || current === null
       || previous === undefined || previous === null
       || previous.type !== 'Thunk'
       || !current.equalStates(current.state, previous.state)
       || !current.equalRenders(current.renderFn, previous.renderFn);
}

module.exports = ImmutableThunk;
