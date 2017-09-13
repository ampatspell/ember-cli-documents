import Ember from 'ember';

export default Ember.Mixin.create({

  _parent: null,

  _detach() {
    this._parent = null;
  }

});
