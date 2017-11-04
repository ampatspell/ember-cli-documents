import createModel from './-create-model';

export default createModel({
  create(owner, opts, type, build) {
    if(!type) {
      return;
    }
    return build((target, parent, modelOpts) => target._createInternalModel(type, parent, modelOpts));
  }
});
