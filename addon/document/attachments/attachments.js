import Ember from 'ember';

export default Ember.Object.extend({

  _internal: null,

  willDestroy() {
    this._internal._modelWillDestroy();
    this._super();
  }

});
