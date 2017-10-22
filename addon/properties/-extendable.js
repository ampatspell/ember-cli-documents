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

const __mergeArray = (opts, next, key) => {
  let opts_ = opts[key] || [];
  let next_ = next[key] || [];
  opts[key] = A([ ...next_, ...opts_ ]).uniq();
}

const __mergeFunction = (opts, next, key) => {
  let fn = next[key];
  if(!fn) {
    return;
  }
  let _super = opts[key];
  opts[key] = (...args) => fn.call({ _super }, ...args);
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
  // functions.forEach(key => __mergeFunction(opts, next, key));
  __mergeUnknown(opts, next);
  return opts;
};

const __invoke = (builder, opts) => {
  if(typeof builder === 'function') {
    return builder.call({}, opts);
  }
  return builder;
}

const _invoke = (builder, opts) => __invoke(builder, opts) || {};

const _merge = builders => {
  builders = copy(builders).reverse();

  let opts = _mergeStep({}, {});

  builders.forEach(builder => {
    console.log('>', copy(opts, true));
    let result = _invoke(builder, opts);
    console.log('<', copy(result, true));
    opts = _mergeStep(opts, result);
  });

  console.log(opts);

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
