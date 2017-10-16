import Ember from 'ember';

export default Ember.Object.extend({

  _lookup: null,

  unknownProperty(identifier) {
    return this._lookup(identifier);
  }

});
