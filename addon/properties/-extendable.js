import Ember from 'ember';
import { omit } from '../util/object';

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

const omitSpecial = step => omit(step, [ 'owner', 'document', 'query', 'matches', 'load' ]);
const mergeStep = (result, step) => merge(result, omitSpecial(step));

const mergeBuilders = array => array.reduce((result, step) => {
  mergeArrays(result, step, 'owner');
  mergeArrays(result, step, 'document');
  mergeFunctions(result, step, 'query');
  mergeFunctions(result, step, 'matches');
  mergeFunctions(result, step, 'loaded');
  return mergeStep(result, step);
}, {});

const invokeBuilders = (opts, builders) => {
  builders.reverse();
  let step = copy(opts, true);
  return [ opts, ...builders.map(builder => {
    let result = builder(step);
    step = mergeStep(result, step);
    return copy(result, true);
  }) ];
};

const build = (opts, builders) => {
  let arr = invokeBuilders(opts, builders);
  let merged = mergeBuilders(arr);
  return merged;
};

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
