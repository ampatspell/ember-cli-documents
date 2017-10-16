import Ember from 'ember';

export default Ember.Mixin.create({

  proxy(type, owner, opts) {
    let internal = this._createInternalProxy(type, owner, opts);
    return internal.model(true);
  }

});
