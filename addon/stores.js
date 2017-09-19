import Ember from 'ember';
import { object } from './util/computed';
import { destroyObject } from './util/destroy';

const {
  getOwner,
  assign
} = Ember;

export default Ember.Service.extend({

  openStores: object().readOnly(),

  _storeFactory: null,

  storeFactory() {
    let Factory = this._storeFactory;
    if(!Factory) {
      Factory = getOwner(this).factoryFor('documents:store');
      this._storeFactory = Factory;
    }
    return Factory;
  },

  createStore(opts) {
    let stores = this;
    return this.storeFactory().create(assign({ stores }, opts));
  },

  store(opts) {
    let { url } = opts;
    let open = this.get('openStores');
    let store = open[url];
    if(!store) {
      store = this.createStore(opts);
      open[url] = store;
    }
    return store;
  },

  willDestroy() {
    let stores = this.cacheFor('openStores');
    if(stores) {
      destroyObject(stores);
    }
    this._super();
  }

});
