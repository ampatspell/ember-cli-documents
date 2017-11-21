import Mixin from '@ember/object/mixin';

export default Mixin.create({

  _createInternalModel(name, parent, opts={}) {
    opts.database = this;
    return this.get('store')._createInternalModel(name, parent, opts);
  },

  _createInternalModels(name, parent, source, opts={}) {
    opts.props = opts.props || {};
    opts.props.database = this;
    return this.get('store')._createInternalModels(name, parent, source, opts);
  },

  model(name, opts) {
    return this._createInternalModel(name, null, opts).model(true);
  },

  models(name, source, opts) {
    return this._createInternalModels(name, null, source, opts).model(true);
  }

});
