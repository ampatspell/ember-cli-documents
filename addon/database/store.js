import Ember from 'ember';

export default Ember.Mixin.create({

  store: null,
  identifier: null,

  willDestroy() {
    this.get('store')._databaseWillDestroy(this);
    this._super();
  }

});
