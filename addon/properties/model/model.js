import createModel from './-create-model';

export default createModel({
  create(opts, definition, store, database, parent) {
    let { type, props } = definition;
    if(!type) {
      return;
    }
    return store._createInternalModel(type, parent, database, props);
  }
});
