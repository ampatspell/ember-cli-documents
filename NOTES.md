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
