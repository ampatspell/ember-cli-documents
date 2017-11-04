import createModel from './-create-model';

const getSource = (owner, opts) => {
  let source = opts.source;
  if(!source) {
    return;
  }
  return source(owner);
};

export default createModel({
  create(owner, target, opts, parent, mergeModelOpts) {
    let source = getSource(owner, opts);
    if(!source) {
      return;
    }

    return target._createInternalModels(opts.type, parent, source, mergeModelOpts());
  }
});
