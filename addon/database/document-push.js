import Ember from 'ember';

export default Ember.Mixin.create({

  document(values) {
    return this._createInternalDocument({}, values);
  }

});
