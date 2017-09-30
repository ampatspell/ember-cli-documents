import Ember from 'ember';

export default Ember.ObjectProxy.extend({

  _internal: null,

  willDestroy() {
    this._internal._modelWillDestroy();
    this._super();
  }

});
