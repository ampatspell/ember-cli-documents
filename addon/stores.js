import Ember from 'ember';
import { object } from './util/computed';
import { destroyObject } from './util/destroy';

const {
  getOwner,
  assign
} = Ember;

export default Ember.Service.extend({

  openStores: object().readOnly(),

  createStore(opts) {
    let stores = this;
    return getOwner(this).factoryFor('documents:store').create(assign({ stores }, opts));
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
