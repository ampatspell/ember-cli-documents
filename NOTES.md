# TODO

* prefixed keys should be used only for document properties
* check if it is possible to serialize keys in `_setValue` instead of somewhere in parent. `_setValue` type is for key and value, `_getValue` type is for key. both are transform `from` given type to internal representation.
* move attachment handling into `_deserializeValue` or smth. document `_setValue` override is not ok.
* store.settle promise
* fastboot support
* ember inspector integration
* loadable collection and document computed properties
* array deserialize should diff existing content not just clear existing content

## Collect and flush pending fetches

Same goes for separate load by id. Those can be unified by using `_all_docs?keys=...`.

``` javascript
_addDatabaseOperation(op) {
  this.operations.push(op);
  cancel(__invokeOpeations);
  this.__invokeOperations = run.schedule('afterRender', this, this._invokeOpeations);
}

_invokeOperations() {
  this.operations.forEach(op => op.invoke());
}
```

## Computed property teardown

* https://github.com/runspired/rate-limit-computed/blob/master/addon/throttled.js#L35
* https://github.com/machty/ember-concurrency/blob/master/addon/utils.js#L45
