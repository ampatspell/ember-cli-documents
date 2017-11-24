import EmberObject from '@ember/object';

export default EmberObject.extend({

  _lookup: null,

  unknownProperty(identifier) {
    return this._lookup(identifier);
  }

});
