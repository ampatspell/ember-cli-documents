import Ember from 'ember';

const {
  merge
} = Ember;

export default Ember.Mixin.create({

  model(name, opts) {
    let database = this;
    return this.get('store').model(name, merge({ database }, opts));
  }

});
