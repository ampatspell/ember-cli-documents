import Ember from 'ember';

export default Ember.Mixin.create({

  model(name, opts) {
    return this.get('store')._createInternalModel(name, null, this, opts).model(true);
  }

});
