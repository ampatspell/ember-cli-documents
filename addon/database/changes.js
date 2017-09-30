import Ember from 'ember';
import { array } from '../util/computed';
import { destroyArray } from '../util/destroy';

export default Ember.Mixin.create({

  openChanges: array(),

  _createInternalChanges(opts) {
    return this.get('store')._createInternalDatabaseChanges(this, opts);
  },

  _registerInternalChanges(internal) {
    this.get('openChanges').pushObject(internal);
    return internal;
  },

  changes(opts) {
    let internal = this._createInternalChanges(opts);
    this._registerInternalChanges(internal);
    return internal.model(true);
  },

  willDestroy() {
    destroyArray(this.get('openChanges'));
    this._super();
  }

});
