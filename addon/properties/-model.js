import createModel from './-create-model';

export default createModel({
  create(owner, target, opts, parent, mergeModelOpts) {
    return target._createInternalModel(opts.type, parent, mergeModelOpts());
  }
});
