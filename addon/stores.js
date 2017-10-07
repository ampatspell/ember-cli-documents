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

  adapterFactory(name, type) {
    let factories = this.get('_adapterFactories');
    let fullName = `${name}/${type}`;
    let factory = factories[fullName];
    if(!factory) {
      factory = getOwner(this).factoryFor(`documents:adapter/${fullName}`);
      factories[fullName] = factory;
    }
    return factory;
  },

  createStore(opts) {
    let stores = this;
    return this.storeFactory().create(assign({ stores }, opts));
  },

  store(opts) {
    opts = assign({ adapter: 'couch' }, opts);

    let Adapter = this.adapterFactory(opts.adapter, 'store');
    let identifier = Adapter.class.identifierFor(opts);

    let open = this.get('openStores');
    let store = open[identifier];

    if(!store) {
      let stores = this;
      let _adapter = Adapter.create(assign({ _adapter: opts.adapter, identifier, stores }, opts));
      opts = assign(opts, { _adapter });
      store = this.createStore(opts);
      _adapter.setProperties({ store });
      open[identifier] = store;
    }

    return store;
  },

  _storeWillDestroy(store) {
    let identifier = store.get('_adapter.identifier');
    let openStores = this.get('openStores');
    delete openStores[identifier];
  },

  willDestroy() {
    let stores = this.get('openStores');
    if(stores) {
      destroyObject(stores);
    }
    this._super();
  }

});
