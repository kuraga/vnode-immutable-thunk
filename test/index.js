var test = require('tape');

var immutableThunk = require('../index');

test('immutableThunk is a function', function (assert) {
    assert.equal(typeof immutableThunk, 'function');

    assert.end();
});

test('render is invoked', function (assert) {
    var initial = { favorite: 'dogs' };
    var render = function (state) {
        renderCount++;
    };

    var renderCount = 0;
    var thunk = immutableThunk(render, initial);
    thunk.render();
    assert.equal(renderCount, 1);

    assert.end();
});

test('render is invoked with correct argument as object', function (assert) {
    var initial = { favorite: 'dogs' };
    var render = function (state) {
        assert.equal(state, initial);
    };

    var thunk = immutableThunk(render, initial);
    thunk.render();

    assert.end();
});

test('render is invoked with correct list of arguments', function (assert) {
    var initial = [1, {foo: 'bar'}, false];
    var render = function () {
        assert.equal(arguments.length, initial.length)
        for(var i = 0; i<arguments.length; i++) {
            assert.equal(arguments[i], initial[i])
        }
    };

    var thunk = immutableThunk(render, initial);
    thunk.render();

    assert.end();
});

test('thunk can be prototyped with an object', function (assert) {
    var initial = {};
    var proto = { favorite: 'cats', key: 'the-key', subitem: { favorite: 'dogs' } };
    var render = function (state) {
        assert.equal(state, initial);
    };

    var thunk = immutableThunk(render, initial, proto);
    thunk.render();
    assert.equal(thunk.favorite, proto.favorite);
    assert.equal(thunk.key, proto.key);
    assert.deepEqual(thunk.subitem, proto.subitem);

    assert.end();
});

test('the proto can be undefined', function (assert) {
    var initial = {};
    var proto;
    var render = function (state) {
    };

    assert.doesNotThrow(function () {
      immutableThunk(render, initial, proto);
    });

    assert.end();
});

test('the proto can be null', function (assert) {
    var initial = {};
    var proto = null;
    var render = function (state) {
    };

    assert.doesNotThrow(function () {
      immutableThunk(render, initial, proto);
    });

    assert.end();
});

test('the proto can be an object', function (assert) {
    var initial = {};
    var proto = { favorite: 'dogs' };
    var render = function (state) {
    };

    assert.doesNotThrow(function () {
      immutableThunk(render, initial, proto);
    });

    assert.end();
});

test('the proto cannot be a value type number', function (assert) {
    var initial = {};
    var proto = 0;
    var render = function (state) {
    };

    assert.throws(function () {
      immutableThunk(render, initial, proto);
    }, TypeError);

    assert.end();
});

test('the proto cannot be a value type boolean', function (assert) {
    var initial = {};
    var proto = false;
    var render = function (state) {
    };

    assert.throws(function () {
      immutableThunk(render, initial, proto);
    }, TypeError);

    assert.end();
});

test('the proto cannot be a value type string', function (assert) {
    var initial = {};
    var proto = 'test';
    var render = function (state) {
    };

    assert.throws(function () {
      immutableThunk(render, initial, proto);
    }, TypeError);

    assert.end();
});

test('the proto cannot be an array', function (assert) {
    var initial = {};
    var proto = [ 1, 2, 3 ];
    var render = function (state) {
    };

    assert.throws(function () {
      immutableThunk(render, initial, proto);
    }, TypeError);

    assert.end();
});

test('the proto cannot be a function', function (assert) {
    var initial = {};
    var proto = function () {};
    var render = function (state) {
    };

    assert.throws(function () {
      immutableThunk(render, initial, proto);
    }, TypeError);

    assert.end();
});

test('custom equalStates can be used', function (assert) {
    var initial = { favorite: 'cats' };
    var update = { favorite: 'dogs' };
    var proto = {};
    var render = function (state) {
    };
    var equalStates = function (currentStates, previousStates) {
        equalStatesCount++;

        return true;
    };

    var previousThunk = immutableThunk(render, initial);
    var currentThunk = immutableThunk(render, update, proto, equalStates);

    var equalStatesCount = 0;
    currentThunk.render(previousThunk);
    assert.equal(equalStatesCount, 1);

    assert.end();
});

test('the equalStates is invoked with correct arguments', function (assert) {
    var initial = { favorite: 'cats' };
    var update = { favorite: 'dogs' };
    var proto = {};
    var render = function (state) {
    };
    var equalStates = function (currentStates, previousStates) {
        assert.strictEqual(currentStates.favorite, update.favorite);
        assert.strictEqual(previousStates.favorite, initial.favorite);

        return true;
    };

    var previousThunk = immutableThunk(render, initial);
    var currentThunk = immutableThunk(render, update, proto, equalStates);

    currentThunk.render(previousThunk);

    assert.end();
});

test('no rerender if the equalStates returns true', function (assert) {
    var initial = {};
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = function (currentStates, previousStates) {
        return true;
    };

    var thunk = immutableThunk(render, initial, proto, equalStates);
    thunk.render();

    var renderCount = 0;
    thunk.render(thunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('no rerender if the equalStates is true', function (assert) {
    var initial = {};
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = true;

    var thunk = immutableThunk(render, initial, proto, equalStates);
    thunk.render();

    var renderCount = 0;
    thunk.render(thunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('rerender if the equalStates returns false', function (assert) {
    var initial = {};
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = function (currentStates, previousStates) {
        return false;
    };

    var thunk = immutableThunk(render, initial, proto, equalStates);
    thunk.render();

    var renderCount = 0;
    thunk.render(thunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('rerender if the equalStates is false', function (assert) {
    var initial = {};
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = false;

    var thunk = immutableThunk(render, initial, proto, equalStates);
    thunk.render();

    var renderCount = 0;
    thunk.render(thunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('custom equalRenderers can be used', function (assert) {
    var initial = { favorite: 'cats' };
    var proto = {};
    var render = function (state) {
    };
    var equalStates = null;
    var equalRenderers = function (currentStates, previousStates) {
        equalRenderersCount++;

        return true;
    };

    var previousThunk = immutableThunk(render, initial);
    var currentThunk = immutableThunk(render, initial, proto, equalStates, equalRenderers);

    var equalRenderersCount = 0;
    currentThunk.render(previousThunk);
    assert.equal(equalRenderersCount, 1);

    assert.end();
});

test('the equalRenderers is invoked with correct arguments', function (assert) {
    var initial = { favorite: 'cats' };
    var update = { favorite: 'dogs' };
    var proto = {};
    var render = function (state) {
    };
    var equalStates = null;
    var equalRenderers = function (currentStates, previousStates) {
        assert.strictEqual(currentStates.favorite, update.favorite);
        assert.strictEqual(previousStates.favorite, initial.favorite);

        return true;
    };

    var previousThunk = immutableThunk(render, initial);
    var currentThunk = immutableThunk(render, update, proto, equalStates, equalRenderers);

    currentThunk.render(previousThunk);

    assert.end();
});

test('no rerender if the equalRenderers returns true', function (assert) {
    var initial = {};
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = null;
    var equalRenderers = function (currentStates, previousStates) {
        return true;
    };

    var thunk = immutableThunk(render, initial, proto, equalStates, equalRenderers);
    thunk.render();

    var renderCount = 0;
    thunk.render(thunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('no rerender if the equalRenderers is true', function (assert) {
    var initial = {};
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = null;
    var equalRenderers = true;

    var thunk = immutableThunk(render, initial, proto, equalStates, equalRenderers);
    thunk.render();

    var renderCount = 0;
    thunk.render(thunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('rerender if the equalRenderers returns false', function (assert) {
    var initial = {};
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = null;
    var equalRenderers = function (currentStates, previousStates) {
        return false;
    };
    var thunk = immutableThunk(render, initial, proto, equalStates, equalRenderers);
    thunk.render();

    var renderCount = 0;
    thunk.render(thunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('rerender if the equalRenderers is false', function (assert) {
    var initial = {};
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = null;
    var equalRenderers = false;
    var thunk = immutableThunk(render, initial, proto, equalStates, equalRenderers);
    thunk.render();

    var renderCount = 0;
    thunk.render(thunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('no rerender if there are no state', function (assert) {
    var renderCount = 0;
    var render = function (state) {
        renderCount++;
    };

    var previousThunk = immutableThunk(render);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(render);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('rerender if previous thunk is undefined', function (assert) {
    var renderCount = 0;
    var render = function (state) {
        renderCount++;
    };

    var previousThunk;

    var renderCount = 0;
    var currentThunk = immutableThunk(render);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('rerender if previous thunk is null', function (assert) {
    var renderCount = 0;
    var render = function (state) {
        renderCount++;
    };

    var previousThunk = null;

    var renderCount = 0;
    var currentThunk = immutableThunk(render);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('no rerender if previous thunk is current thunk', function (assert) {
    var initial = {};
    var render = function (state) {
        renderCount++;
    };

    var thunk = immutableThunk(render, initial);
    thunk.render();

    var renderCount = 0;
    thunk.render(thunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('cached vnode is used if previous thunk is current thunk', function (assert) {
    var initial = {};
    var render = function (state) {
    };

    var thunk = immutableThunk(render, initial);
    thunk.render();

    var vnode = { favorite: 'dogs' };
    thunk.vnode = vnode;

    var result = thunk.render(thunk);
    assert.equal(result, vnode);

    assert.end();
});

test('prototyped vnode is used if previous thunk is current thunk', function (assert) {
    var initial = {};
    var vnode = { favorite: 'dogs' };
    var proto = { vnode: vnode };
    var render = function (state) {
    };

    var thunk = immutableThunk(render, initial, proto);
    thunk.render();

    var result = thunk.render(thunk);
    assert.equal(result, vnode);

    assert.end();
});

test('rerender if previous is not a thunk', function (assert) {
    var render = function (state) {
        renderCount++;
    };

    var previousThunk = immutableThunk(render);
    previousThunk.render();

    previousThunk.type = 'Widget';
    var renderCount = 0;
    var currentThunk = immutableThunk(render);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('no rerender if previous thunk state are current thunk state (render functions are the same)', function (assert) {
    var initial = { favorite: 'cats' };
    var render = function (state) {
        renderCount++;
    };

    var previousThunk = immutableThunk(render, initial);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(render, initial);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('no rerender if previous thunk state are current thunk state (render functions are the same, equalStates is null)', function (assert) {
    var initial = { favorite: 'cats' };
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = null;

    var previousThunk = immutableThunk(render, initial);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(render, initial, proto, equalStates);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('no rerender if previous thunk state are current thunk state (render functions are the same, equalStates is null, equalRenderers is null)', function (assert) {
    var initial = { favorite: 'cats' };
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = null;
    var equalRenderers = null;

    var previousThunk = immutableThunk(render, initial);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(render, initial, proto, equalStates, equalRenderers);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('no rerender if previous thunk state is equal to current thunk state (render functions are the same)', function (assert) {
    var initial = { favorite: 'cats', subitem: { favorite: 'dogs' } };
    var update = { favorite: 'cats', subitem: { favorite: 'dogs' } };
    var render = function (state) {
        renderCount++;
    };

    var previousThunk = immutableThunk(render, initial);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(render, update);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('no rerender if previous thunk state is equal to current thunk state (render functions are the same, equalStates is null)', function (assert) {
    var initial = { favorite: 'cats', subitem: { favorite: 'dogs' } };
    var update = { favorite: 'cats', subitem: { favorite: 'dogs' } };
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = null;

    var previousThunk = immutableThunk(render, initial);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(render, update, proto, equalStates);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('no rerender if previous thunk state is equal to current thunk state (render functions are the same, equalStates is null, equalRenderers is null)', function (assert) {
    var initial = { favorite: 'cats', subitem: { favorite: 'dogs' } };
    var update = { favorite: 'cats', subitem: { favorite: 'dogs' } };
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = null;
    var equalRenderers = null;

    var previousThunk = immutableThunk(render, initial, equalRenderers);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(render, update, proto, equalStates);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 0);

    assert.end();
});

test('rerender if previous thunk state is equal to current thunk state', function (assert) {
    var initial = { favorite: 'cats', subitem: { favorite: 'dogs' } };
    var update = { favorite: 'cats' };
    var render = function (state) {
        renderCount++;
    };

    var previousThunk = immutableThunk(render, initial);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(render, update);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('rerender if previous thunk state is equal to current thunk state (equalStates is null)', function (assert) {
    var initial = { favorite: 'cats', subitem: { favorite: 'dogs' } };
    var update = { favorite: 'cats' };
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var equalStates = null;

    var previousThunk = immutableThunk(render, initial);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(render, update, proto, equalStates);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('rerender if renders are different functions', function (assert) {
    var render1 = function (state) {
    };
    var render2 = function (state) {
        render2Count++;
    };

    var previousThunk = immutableThunk(render1);
    previousThunk.render();

    var render2Count = 0;
    var currentThunk = immutableThunk(render2);
    currentThunk.render(previousThunk);
    assert.equal(render2Count, 1);

    assert.end();
});

test('rerender if renders are different bindings of the same function', function (assert) {
    var render = function (state) {
        renderCount++;
    };
    var obj1 = {};
    var obj2 = {};
    var bindedRender1 = render.bind(obj1);
    var bindedRender2 = render.bind(obj2);

    var previousThunk = immutableThunk(bindedRender1);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(bindedRender2);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 1);

    assert.end();
});

test('rerender if renders are different functions (equalRenderers is null)', function (assert) {
    var initial = {};
    var proto = {};
    var render1 = function (state) {
    };
    var render2 = function (state) {
        render2Count++;
    };
    var equalStates = null;
    var equalRenderers = null;

    var previousThunk = immutableThunk(render1);
    previousThunk.render();

    var render2Count = 0;
    var currentThunk = immutableThunk(render2, initial, proto, equalStates, equalRenderers);
    currentThunk.render(previousThunk);
    assert.equal(render2Count, 1);

    assert.end();
});

test('rerender if renders are different bindings of the same function (equalRenderers is null)', function (assert) {
    var initial = {};
    var proto = {};
    var render = function (state) {
        renderCount++;
    };
    var obj1 = {};
    var obj2 = {};
    var bindedRender1 = render.bind(obj1);
    var bindedRender2 = render.bind(obj2);
    var equalStates = null;
    var equalRenderers = null;

    var previousThunk = immutableThunk(bindedRender1);
    previousThunk.render();

    var renderCount = 0;
    var currentThunk = immutableThunk(bindedRender2, initial, proto, equalStates, equalRenderers);
    currentThunk.render(previousThunk);
    assert.equal(renderCount, 1);

    assert.end();
});
