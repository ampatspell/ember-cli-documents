# TODO

* loader `enabled` which can be set from parent (disable when identity has a doc)
* loader `load` -> `autoload fails` -> `isLoaded` is kept true
* split internal/base into absolute base which is useful for proxies.
* ember inspector integration
* loadable collection and document computed properties
* array deserialize should diff existing content not just clear existing content

# Notes

## Computed property teardown examples

* https://github.com/runspired/rate-limit-computed/blob/master/addon/throttled.js#L35
* https://github.com/machty/ember-concurrency/blob/master/addon/utils.js#L45
