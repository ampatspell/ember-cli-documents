import Ember from 'ember';

export default Ember.Mixin.create({

  stores: null,

  _adapter: null,
  _opts: null,

  willDestroy() {
    this.get('stores')._storeWillDestroy(this);
    this._super();
  }

});
