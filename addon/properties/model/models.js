import { isArray } from '../../util/assert';
import createModel from './-create-model';

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

    let model = opts.model;

    return target._createInternalModels(type, parent, source, { model, props });
  }
});
