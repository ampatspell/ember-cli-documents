# TODO

* move default `-create-state` states to appropriate classes
* provide currently matched documents to query (`find-by-ids` loader doesn't need to reload existing docs)
* `_shouldDeserializeInternalLoad` `parseInt(doc._rev)` compare to existing int so only newer revs are deserialized
* loader state vs proxy state for ArrayProxy and ObjectProxy
* export and reorganize properties
* maybe add `isLoaded` function in proxy opts to determine whether load should happen
* loader is already loaded if identical query was invoked
* proxy state. deleted doc should have err.error=not_found
* split internal/base into absolute base which is useful for proxies.
* batch identity adds and removes `this._withIdentityMutation(mutation => ...)`
* ember inspector integration (for proxies?)
* array deserialize should diff existing content not just clear existing content
* have a `json` and `toJSON` instead of `serialized` and `serialize`.
* `object.copy()` for documents, objects and arrays. makes a detached, deep copy.
* figure out how to get saves in one `_bulk_docs` call (also `all_or_nothing: true` would be nice option for `db.save(docs)`)
* view reduce proxy for load, reload & underlying internal stuff for that in `db.find` or `db.reduce`
* come up with an API for conflict resolution


# Notes

## Loader

* Current query hash should be created
* isLoadable is based on that
* cached query recreated/invalidated on owner props change

This also includes needed changes for load operations.

So, if query is pre-built, in next runloop that might already be invalidated. That cancelPending thing

## find `{ id }`, `{ ids }`

Basically idea is to support usecases w/o changes listener.

* always load byId, byIds, force means force deserialize?
* but anyway, always mark existing internals `{ isLoading: true }`
* `{ ids }` should reject if some of docs are not found _and_ if any of existing internals are marked deleted

```
db.find({ id, force })
db.find({ ids, force })
```

After that, proxies can come up with load id/ids based on existing models.

Proxy def can have a mixin for `byId`, `byIds` which would choose whether to load existing, loaded docs. Not sure if necessary.

## Loader state vs proxy.content state

> "Assertion Failed: You modified "subject.isLoading" twice on <dummy@documents:proxy/document::ember484> in a single render.

Due to the fact that proxy.content is document which has isLoading triggered at the same runloop where loader triggers it's own isLoading.

* Loader should continue to have separate state
* DocumentProxy should forward state (and trigger prop changes) only if there is no content
* All proxies should have some unified principle how state is forwarded.
