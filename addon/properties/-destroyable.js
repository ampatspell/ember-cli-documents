import Ember from 'ember';
import EmptyObject from 'documents/util/empty-object';

const {
  computed
} = Ember;

const __ember_cli_documents__ = '__ember_cli_documents__';

const _get = owner => {
  return owner.willDestroy[__ember_cli_documents__];
}

const _cache = (owner, create) => {
  if(!owner) {
    return;
  }
  if(!owner.willDestroy) {
    return;
  }
  let object = _get(owner);
  if(!object && create) {
    object = new EmptyObject();
    let willDestroy = owner.willDestroy;
    owner.willDestroy = function() {
      let object = _get(owner);
      for(let key in object) {
        let hash = object[key];
        hash.destroy(hash.value);
      }
      willDestroy.apply(owner, arguments);
    }
    owner.willDestroy[__ember_cli_documents__] = object;
  }
  return object;
}

const _cacheFor = (owner, key) => {
  let cache = _cache(owner, false);
  if(!cache) {
    return {};
  }
  return cache[key];
}

const _destroyCached = (owner, key, value, destroy) => {
  let cache = _cache(owner);
  delete cache[key];
  destroy(value);
}

const _store = (owner, key, value, destroy) => {
  let cache = _cache(owner, true);
  cache[key] = { value, destroy };
}

export const cacheFor = (owner, key) => {
  let cache = _cache(owner);
  if(!cache) {
    return;
  }
  let hash = cache[key];
  if(!hash) {
    return;
  }
  return hash.value;
}

export default (...args) => {
  let opts = args.pop();
  return computed(...args, function(key) {
    let { value, destroy } = _cacheFor(this, key);

    if(value) {
      _destroyCached(this, key, value, destroy);
    }

    value = opts.create.call(this, key);

    if(!value) {
      return;
    }

    _store(this, key, value, opts.destroy);

    if(opts.get) {
      return opts.get.call(this, value, key);
    }

    return value;
  });
}
