import ModelMixin from 'documents/document/internal/-model-mixin';

export default ModelMixin(class Changes {

  constructor(store, opts) {
    this.store = store;
    this.opts = opts;
    this._adapter = null;
    this.state = {
      isError: false,
      error: null
    };
  }

  adapter(create, notify) {
    let adapter = this._adapter;
    if(!adapter && create) {
      adapter = this._createAdapter(this.opts);
      this._adapter = adapter;
      if(notify) {
        let model = this.model(false);
        if(model) {
          model.notifyPropertyChange('_adapter');
        }
      }
    }
    return adapter;
  }

  destroy() {
    let adapter = this.adapter(false, false);
    if(adapter) {
      adapter.destroy();
      this._adapter = null;
    }
    let model = this.model(false);
    if(model) {
      model.destroy();
    }
  }

});
