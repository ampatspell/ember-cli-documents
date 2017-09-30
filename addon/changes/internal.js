import ModelMixin from 'documents/document/internal/-model-mixin';

export default ModelMixin(class Changes {

  constructor(store, opts) {
    this.store = store;
    this.opts = opts;
  }

  destroy() {
    let model = this.model(false);
    if(model) {
      model.destroy();
    }
  }

});
