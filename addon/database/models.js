import Ember from 'ember';

const {
  merge
} = Ember;

export default Ember.Mixin.create({

  _createInternalModel(name, parent, opts) {
    opts = merge({ database: this }, opts);
    return this.get('store')._createInternalModel(name, parent, opts);
  },

  model(name, opts) {
    return this._createInternalModel(name, null, opts).model(true);
  }

});
