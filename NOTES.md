# TODO

* loader `first` vs `find` type for linked documents support
* `documents/properties` owner dependency vs inlne value handling
* loader `enabled` which can be set from parent (disable when identity has a doc)
* split internal/base into absolute base which is useful for proxies.
* ember inspector integration
* loadable collection and document computed properties
* array deserialize should diff existing content not just clear existing content

# Notes

## Computed property teardown examples

* https://github.com/runspired/rate-limit-computed/blob/master/addon/throttled.js#L35
* https://github.com/machty/ember-concurrency/blob/master/addon/utils.js#L45

## Properties

``` javascript
import { byId, prop } from 'documents/properties';

export default Ember.Object.extend({

  doc: byId({ id: 'duck:yellow' }),
  doc: byId({ id: prop('id') }),
  
});
```

``` javascript
class Property {
  constructor(value) {
    this.value = value;
  }
  get owner() {
    return [];
  }
  match(owner, doc) {
    return doc.get(this.key) === this.value;
  }
}

class OwnerProperty extends Property {
  get owner() {
    return [ this.value ];
  }
  match(owner, doc) {
    return doc.get(this.key) === owner.get(this.value);
  }
}
```

``` javascript
const buildProperties = hash => {
  let props = [];
  for(let key in hash) {
    let value = hash[key];
    let property;
    if(value instanceof Property) {
      property = value;
    } else {
      property = new Property(value);
    }
    property.key = key;
    props.push(property);
  }
  return props;
}
```

``` javascript
doc: byId({ database: 'db', id: 'message:first' })

let { id } = opts;
let props = buildProperties({ id });

const match = (owner, doc) => {
  // filter, find, ...
  props.forEach(prop => {
    props.match(owner, doc);
  });
}
```
