import Ember from 'ember';

export default Ember.Mixin.create({

  _internal: null,

  willDestroy() {
    this._internal._modelWillDestroy();
    this._super();
  }

});
