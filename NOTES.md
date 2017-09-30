# TODO

* changes listener for `/_db_updates` and `db/_changes`
* loadable collection and document computed properties
* store.settle promise
* fastboot support
* ember inspector integration
* array deserialize should diff existing content not just clear existing content

## Changes

``` javascript
// base
location: 'local' / 'remote'
isLocal:
isRemote:

// file
loader: // wrapped Couch file loader with state and promise. PromiseObject?

// string
contentType:
value:

// stub
url:
```

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
