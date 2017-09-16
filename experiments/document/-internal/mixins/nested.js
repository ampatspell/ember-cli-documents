import Ember from 'ember';
import isInternal from '../is-internal';

export default Ember.Mixin.create({

  _parent: null,

  _detach() {
    this._parent = null;
  },

  _serialize(value, opts) {
    if(isInternal(value)) {
      value = value.serialize(opts);
    }
    return value;
  },

});
