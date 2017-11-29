import createModel from './-create-model';

export default createModel({
  create(stores, opts, definition, _parent) {
    let { type, props, source } = definition;

    if(type === null) {
      return;
    }

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
