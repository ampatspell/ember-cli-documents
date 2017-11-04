import createModel from './-create-model';

export default createModel({
  create(owner, target, opts, parent, modelOpts) {
    return target._createInternalModel(opts.type, parent, modelOpts);
  }
});
