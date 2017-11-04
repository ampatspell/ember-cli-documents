import Ember from 'ember';

export default Ember.Mixin.create({

  proxy(type, owner, opts) {
    return this._createInternalProxy(type, owner, opts).model(true);
  }

});
