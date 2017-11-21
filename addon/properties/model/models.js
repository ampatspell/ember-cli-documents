import { get } from '@ember/object';
import { assert, isArray } from '../../util/assert';
import createModel from './-create-model';

const getSource = (owner, opts) => {
  if(typeof opts.source === 'string') {
    return get(owner, opts.source);
  } else if (typeof opts.source === 'function') {
    return opts.source(owner);
  }
  assert('source must be string or function', false);
};

const getValidSource = (owner, opts) => {
  let source = getSource(owner, opts);
  if(!source) {
    return;
  }
  isArray('source function result', source);
  return source;
};

export default createModel({
  create(owner, opts, target, type, parent, props) {
    if(type === null) {
      return;
    }
    let source = getValidSource(owner, opts);
    if(!source) {
      return;
    }
    return target._createInternalModels(type, parent, source, props);
  }
});
