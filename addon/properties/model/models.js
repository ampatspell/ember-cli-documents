import createModel from './-create-model';

const getSource = (owner, opts) => {
  let source = opts.source;
  if(!source) {
    return;
  }
  return source(owner);
};

export default createModel({
  create(owner, opts, type, build) {
    let source = getSource(owner, opts);
    if(!source) {
      return;
    }
    return build((target, parent, modelOpts) => target._createInternalModels(type, parent, source, modelOpts));
  }
});
