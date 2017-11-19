import { get } from '@ember/object';
import assert from '../../util/assert';
import createModel from './-create-model';

const getSource = (owner, opts) => {
  if(typeof opts.source === 'string') {
    return get(owner, opts.source);
  } else if (typeof opts.source === 'function') {
    return opts.source(owner);
  }
  assert(`source must be string or function`, false);
};

export default createModel({
  create(owner, opts, type, build) {
    if(type === null) {
      return;
    }
    let source = getSource(owner, opts);
    if(!source) {
      return;
    }
    return build((target, parent, modelOpts) => target._createInternalModels(type, parent, source, modelOpts));
  }
});
