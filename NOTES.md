# TODO

* loader state vs proxy state for ArrayProxy and ObjectProxy
* support proxy w/o loader
* don't attempt to load if loader.query is falsy
* export and reorganize properties
* provide currently matched documents to query (`find-by-ids` loader doesn't need to reload existing docs)
* how hard would it be to implement `find({ ids: [...] })` as a single operation given some of ids is already loaded?
* maybe add `isLoaded` function in proxy opts to determine whether load should happen
* loader needs `cancelPending` where canceled pending ops are resolved when added op is resolved, have a proper queue for loads, especially for force reloads so that latest force reload resolves last
* loader is already loaded if identical query was invoked
* proxy state. deleted doc should have err.error=not_found
* split internal/base into absolute base which is useful for proxies.
* batch identity adds and removes `this._withIdentityMutation(mutation => ...)`
* ember inspector integration (for proxies?)
* array deserialize should diff existing content not just clear existing content

# Notes

## Loader state vs proxy.content state

> "Assertion Failed: You modified "subject.isLoading" twice on <dummy@documents:proxy/document::ember484> in a single render.

Due to the fact that proxy.content is document which has isLoading triggered at the same runloop where loader triggers it's own isLoading.

* Loader should continue to have separate state
* DocumentProxy should forward state (and trigger prop changes) only if there is no content
* All proxies should have some unified principle how state is forwarded.
