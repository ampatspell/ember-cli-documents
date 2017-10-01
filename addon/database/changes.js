import Ember from 'ember';
import Mixin from '../changes/-mixin';

export default Ember.Mixin.create(Mixin, {

  __createInternalChanges(opts) {
    return this.get('store')._createInternalDatabaseChanges(this, opts);
  }

});