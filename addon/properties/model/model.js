import createModel from './-create-model';

export default createModel({
  create(owner, opts, target, type, parent, props) {
    if(!type) {
      return;
    }
    return target._createInternalModel(type, parent, props);
  }
});
