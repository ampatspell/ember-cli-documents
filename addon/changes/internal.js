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

  adapter(create=true, notify=true) {
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

  //

  setState(props) {
    let model = this.model(false);
    if(model) {
      model.beginPropertyChanges();
    }
    let state = this.state;
    for(let key in state) {
      let current = state[key];
      let value = props[key];
      if(current === value) {
        continue;
      }
      state[key] = value;
      if(model) {
        model.notifyPropertyChange(key);
      }
    }
    if(model) {
      model.endPropertyChanges();
    }
  }

  start() {
    this.adapter().start();
  }

  stop() {
    this.adapter().stop();
    this.setState({ isError: false, error: null });
  }

  restart() {
    this.adapter().restart();
  }

  suspend() {
    return this.adapter().suspend();
  }

});
