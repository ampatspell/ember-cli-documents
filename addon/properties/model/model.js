import createModel from './-create-model';

export default createModel({
  create(owner, opts, definition, target, parent) {
    let { type, props } = definition;
    if(!type) {
      return;
    }
    return target._createInternalModel(type, parent, props);
  }
});
