import createModel from './-create-model';

export default createModel({
  create(target, type, parent, opts) {
    return target._createInternalModels(type, parent, opts);
  }
});
