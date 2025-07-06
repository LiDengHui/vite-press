# Call

```js
Function.prototype.myCall = function (ctx, ...args) {
    ctx = ctx === null || ctx === undefined ? globalThis : Object(ctx);

    var key = Symbol('temp');

    Object.defineProperty(ctx, key, {
        enumerable: false,
        value: this,
        configurable: true
    });

    var result = ctx[key](...args);
    delete ctx[key];
    return result;
};

function method(a, b) {
    console.log(this, a, b);
}

method.myCall(null, 1, 2);

```