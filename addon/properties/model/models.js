import { isArrayOrArrayProxy } from '../../util/assert';
import createModel from './-create-model';

export default createModel({
  create(stores, opts, definition, _parent) {
    let { type, props, source } = definition;

    if(type === null) {
      return;
    }

    if(!source) {
      return;
    }

    isArrayOrArrayProxy('source in create function result', source);

    let model = opts.model;

    return stores._createInternalModels({
      source,
      type,
      props,
      _parent,
      model
    });
  }
});
