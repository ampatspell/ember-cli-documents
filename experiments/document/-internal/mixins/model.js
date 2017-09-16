import Ember from 'ember';

const {
  getOwner,
  merge
} = Ember;

export default Ember.Mixin.create({

  _model: null,

  _createModel() {
    let owner = getOwner(this);
    let factory = this._modelFactory(owner);
    let _internal = this;
    let props = { _internal };
    if(this._createModelProperties) {
      props = merge(props, this._createModelProperties());
    }
    return factory.create(props);
  },

  model(create=true) {
    let model = this.get('_model');
    if(!model && create) {
      model = this._createModel();
      this.set('_model', model);
    }
    return model;
  }

});
