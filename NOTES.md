# TODO

* provide currently matched documents to query (`find-by-ids` loader doesn't need to reload existing docs)
* how hard would it be to implement `find({ ids: [...] })` as a single operation given some of ids is already loaded?
* maybe add `isLoaded` function in proxy opts to determine whether load should happen
* clean up Proxy stack impl
* loader needs `cancelPending` where canceled pending ops are resolved when added op is resolved, have a proper queue for loads, especially for force reloads so that latest force reload resolves last
* loader state vs proxy state for ArrayProxy and ObjectProxy
* `documents/properties` owner dependency vs inlne value handling, `isNew` default, `prop`. `byId.extend`
* support proxy w/o loader
* loader is already loaded if identical query was invoked
* proxy state. deleted doc should have err.error=not_found
* split internal/base into absolute base which is useful for proxies.
* batch identity adds and removes `this._withIdentityMutation(mutation => ...)`
* ember inspector integration
* array deserialize should diff existing content not just clear existing content

# Notes

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
