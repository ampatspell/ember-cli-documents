import Ember from 'ember';
import { omit } from '../util/object';

const {
  A,
  copy
} = Ember;

const arrays = [ 'owner', 'document' ];
const functions = [ 'query', 'matches', 'loaded' ];
const special = [ ...arrays, ...functions ];

const __mergeArray = (opts, next, key) => {
  let opts_ = opts[key] || [];
  let next_ = next[key] || [];
  opts[key] = A(A([ ...next_, ...opts_ ]).compact()).uniq();
}

const __mergeFunction = (opts, next, key) => {
  let opts_ = opts[key];
  if(!opts_) {
    opts_ = [];
    opts[key] = opts_;
  }

  let fn = next[key];
  if(!fn) {
    return;
  }

  opts_.push(fn);
}

const __mergeUnknown = (opts, next) => {
  next = omit(next, special);
  for(let key in next) {
    opts[key] = next[key];
  }
}

const _mergeStep = (opts, next) => {
  opts = copy(opts, true);
  arrays.forEach(key => __mergeArray(opts, next, key));
  functions.forEach(key => __mergeFunction(opts, next, key));
  __mergeUnknown(opts, next);
  return opts;
};

const _mergeFunctions = (opts, key) => {
  let arr = opts[key].reverse();
  delete opts[key];

  if(arr.length === 0) {
    return;
  }

  let last = null;

  arr.forEach(fn => {
    let _super = last;
    last = (...args) => fn.call({ _super }, ...args);
  });

  opts[key] = last;
};

const _postMerge = opts => {
  functions.forEach(key => _mergeFunctions(opts, key));
  return opts;
};

const __invoke = (builder, opts) => {
  if(typeof builder === 'function') {
    return builder.call({}, omit(opts, functions));
  }
  return builder;
}

const _invoke = (builder, opts) => __invoke(builder, opts) || {};

const _merge = builders => {
  builders = copy(builders).reverse();

  let opts = _mergeStep({}, {});

  builders.forEach(builder => {
    let result = _invoke(builder, opts);
    opts = _mergeStep(opts, result);
  });

  opts = _postMerge(opts);

  return opts;
};

class Context {

  constructor(builders=[]) {
    this.builders = builders;
  }

  extend(builder) {
    return new this.constructor([ ...this.builders, builder ]);
  }

  merge() {
    return _merge(this.builders);
  }

  build(builder) {
    return this.extend(builder).merge();
  }

}

const extendable = (target, context) => {
  let fn = builder => target(context.build(builder));
  fn.extend = builder => extendable(target, context.extend(builder))
  return fn;
};

export default target => extendable(target, new Context());
