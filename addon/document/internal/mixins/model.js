import Ember from 'ember';

const {
  getOwner
} = Ember;

export default Ember.Mixin.create({

  _model: null,

  _createModel() {
    let _internal = this;
    let owner = getOwner(this);
    let factory = this._modelFactory(owner);
    return factory.create({ _internal });
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
