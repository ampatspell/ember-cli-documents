import Ember from 'ember';

export default Ember.Mixin.create({

  store: null,
  identifier: null,

  toStringExtension() {
    return this.get('identifier');
  },

  willDestroy() {
    this.get('store')._databaseWillDestroy(this);
    this._super();
  }

});
