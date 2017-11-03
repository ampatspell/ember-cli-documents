import Ember from 'ember';

const {
  merge
} = Ember;

export default Ember.Mixin.create({

  model(name, opts) {
    opts = merge({ database: this }, opts);
    return this.get('store')._createInternalModel(name, null, opts).model(true);
  }

});
