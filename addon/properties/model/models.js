import { isArrayOrArrayProxy } from '../../util/assert';
import createModel from './-create-model';

export default createModel({
  create(opts, definition, store, database, _parent) {
    let { type, props, source } = definition;

    if(type === null) {
      return;
    }

    if(!source) {
      return;
    }

    isArrayOrArrayProxy('source in create function result', source);

    let model = opts.model;

    return store._createInternalModels({
      database,
      source,
      type,
      props,
      _parent,
      model
    });
  }
});
