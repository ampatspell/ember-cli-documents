import Ember from 'ember';
import { array } from '../util/computed';
import { destroyArray } from '../util/destroy';

export default Ember.Mixin.create({

  openChanges: array(),

  changes(opts) {
    let changes = {
      destroy() {}
    };
    this.get('openChanges').pushObject(changes);
    return changes;
  },

  willDestroy() {
    destroyArray(this.get('openChanges'));
    this._super();
  }

});
