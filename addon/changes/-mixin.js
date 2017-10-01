import Ember from 'ember';
import { array } from '../util/computed';
import { destroyArray } from '../util/destroy';

export default Ember.Mixin.create({

  _changes: array(),

  _registerInternalChanges(internal) {
    this.get('_changes').pushObject(internal);
    return internal;
  },

  changes(opts) {
    let internal = this.__createInternalChanges(opts);
    this._registerInternalChanges(internal);
    return internal.model(true);
  },

  willDestroy() {
    destroyArray(this.get('_changes'));
    this._super();
  }

});
