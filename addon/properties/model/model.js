import createModel from './-create-model';

export default createModel({
  create(opts, definition, store, database, _parent) {
    let { type, props } = definition;
    if(!type) {
      return;
    }
    return store._createInternalModel({
      database,
      type,
      props,
      _parent
    });
  }
});
