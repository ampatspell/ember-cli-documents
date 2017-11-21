import { assign } from '@ember/polyfills';
import { isArray, isObject } from '../../util/assert';
import createModel from './-create-model';

const mergeProps = (props, opts) => {
  let model = opts.model;
  isObject('model', model);
  return assign({}, props, { model });
};

export default createModel({
  create(owner, opts, definition, target, parent) {
    let { type, props, source } = definition;

    if(type === null) {
      return;
    }

    if(!source) {
      return;
    }

    isArray('source in create function result', source);

    props = mergeProps(props, opts);

    return target._createInternalModels(type, parent, source, props);
  }
});
