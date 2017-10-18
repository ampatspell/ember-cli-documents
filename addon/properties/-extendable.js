import Ember from 'ember';

const {
  A,
  merge,
  copy
} = Ember;

const mergeArrays = (base, extend, key) => {
  let base_ = base[key];
  let extend_ = extend[key];
  if(!base_ && !extend_) {
    return;
  }
  base_ = base_ || [];
  extend_ = extend_ || [];
  base[key] = A([...base_, ...extend_]).uniq().map(item => item);
};

const mergeFunctions = (base, extend, key) => {
  let base_ = base[key];
  let extend_ = extend[key];
  if(extend_) {
    base[key] = (...args) => extend_.call({ _super: base_ }, ...args);
  }
}

const mergeBuilders = array => array.reduce((result, item) => {
  mergeArrays(result, item, 'owner');
  mergeArrays(result, item, 'document');
  mergeFunctions(result, item, 'query');
  mergeFunctions(result, item, 'matches');
  mergeFunctions(result, item, 'loaded');
  return merge(result, item);
}, {});

const invokeBuilders = (opts, builders) => {
  builders.reverse();
  let step = copy(opts, true);
  return [ opts, ...builders.map(builder => {
    let result = builder(step);
    step = merge(step, result);
    return copy(result, true);
  }) ];
};

const build = (opts, builders) => mergeBuilders(invokeBuilders(opts, builders));

const extendable = (target, builders = []) => {
  let fn = opts => {
    return target(build(opts, [ ...fn._builders ]));
  };
  fn._builders = builders;
  fn.extend = builder => {
    return extendable(target, [ ...fn._builders, builder ]);
  };
  return fn;
};

export default target => extendable(target);
