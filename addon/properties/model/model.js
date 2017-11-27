import createModel from './-create-model';

export default createModel({
  create(stores, opts, definition, _parent) {
    let { type, props } = definition;
    if(!type) {
      return;
    }
    return stores._createInternalModel({
      type,
      props,
      _parent
    });
  }
});
