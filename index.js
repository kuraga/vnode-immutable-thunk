'use strict';

var xtendMutable = require('xtend/mutable');
var deepEqual = require('deep-equal');

function ImmutableThunk(renderFn, state, proto, equalStates, equalRenderers) {
    if (!(this instanceof ImmutableThunk)) {
        return new ImmutableThunk(renderFn, state, proto, equalStates, equalRenderers);
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

    if (equalRenderers === undefined || equalRenderers === null) {
        this.equalRenderers = defaultEqualRenders;
    } else if (equalRenderers === true) {
        this.equalRenderers = justTrue;
    } else if (equalRenderers === false) {
        this.equalRenderers = justFalse;
    } else {
        this.equalRenderers = equalRenderers;
    }
}

ImmutableThunk.prototype.type = 'Thunk';

ImmutableThunk.prototype.render = function render(previous) {
    if (shouldUpdate(this, previous)) {
        return this.renderFn.apply(null, this.state);
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
       || !current.equalRenderers(current.renderFn, previous.renderFn);
}

module.exports = ImmutableThunk;
