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
  _adapterFactories: object(),

  storeFactory() {
    let Factory = this._storeFactory;
    if(!Factory) {
      Factory = getOwner(this).factoryFor('documents:store');
      this._storeFactory = Factory;
    }
    return Factory;
  },

  adapterFactory(name) {
    let factories = this.get('_adapterFactories');
    let factory = factories[name];
    if(!factory) {
      factory = getOwner(this).factoryFor(`documents:adapter/${name}`);
      factories[name] = factory;
    }
    return factory;
  },

  createStore(opts) {
    let stores = this;
    return this.storeFactory().create(assign({ stores }, opts));
  },

  store(opts) {
    opts = assign({ adapter: 'couch' }, opts);

    let Adapter = this.adapterFactory(opts.adapter);
    let identifier = Adapter.class.identifierFor(opts);

    let open = this.get('openStores');
    let store = open[identifier];

    if(!store) {
      let adapter = Adapter.create(opts);
      opts = assign(opts, { adapter });
      store = this.createStore(opts);
      open[identifier] = store;
    }

    return store;
  },

  _storeWillDestroy(store) {
    let url = store.get('url');
    let openStores = this.get('openStores');
    delete openStores[url];
  },

  willDestroy() {
    let stores = this.cacheFor('openStores');
    if(stores) {
      destroyObject(stores);
    }
    this._super();
  }

});
