## Module Report

### Unknown Global

**Global**: `Ember.testing`

**Location**: `tests/dummy/app/instance-initializers/dummy-dev.js` at line 37

```js
    [ 'route', 'component' ].forEach(name => app.inject(name, 'state', 'service:state'));

    if(Ember.testing) {
      return;
    }
```
