import Ember from 'ember';
import { omit } from '../util/object';

const {
  A,
  merge,
  copy
} = Ember;

const arrays = [ 'owner', 'document' ];
const functions = [ 'query', 'matches', 'loaded' ];
const special = [ ...arrays, ...functions ];

const _mergeArray = (opts, next, key) => {
  let opts_ = opts[key] || [];
  let next_ = next[key] || [];
  opts[key] = A([ ...opts_, ...next_ ]).uniq();
}

const _mergeFunction = (opts, next, key) => {
  let fn = next[key];
  if(!fn) {
    return;
  }
  let _super = opts[key];
  opts[key] = (...args) => fn.call({ _super }, ...args);
}

const _mergeUnknown = (opts, next) => {
  merge(opts, omit(next, special));
}

const _merge = (opts, next) => {
  opts = copy(opts, true);
  arrays.forEach(key => _mergeArray(opts, next, key));
  functions.forEach(key => _mergeFunction(opts, next, key));
  _mergeUnknown(opts, next);
  return opts;
};

const __invoke = (builder, opts) => {
  if(typeof builder === 'function') {
    return builder.call({}, opts);
  }
  return builder;
}

const _invoke = (builder, opts) => __invoke(builder, opts) || {};

class Context {

  constructor(opts) {
    opts = opts || _merge({}, {});
    this.opts = copy(opts, true);
  }

  extend(builder) {
    let opts = _merge(this.opts, _invoke(builder, this.opts));
    return new this.constructor(opts);
  }

  build(builder) {
    return this.extend(builder).opts;
  }

}

const extendable = (target, context) => {
  let fn = opts => target(context.build(opts));
  fn.extend = builder => extendable(target, context.extend(builder))
  return fn;
};

export default target => extendable(target, new Context());
