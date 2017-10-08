import Ember from 'ember';
import { object } from '../util/computed';
import createNestedRegistry from '../util/create-nested-registry';

const {
  getOwner,
  assign
} = Ember;

const StoresRegistry = createNestedRegistry({ key: '_stores' });

export default Ember.Mixin.create(StoresRegistry, {

  _stores: null,

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

    let registry = this._stores;
    let store = registry.get(identifier);

    if(!store) {
      let stores = this;
      let _adapter = Adapter.create(assign({ _adapter: opts.adapter, identifier, stores }, opts));
      opts = assign(opts, { _adapter });
      store = this.createStore(opts);
      _adapter.setProperties({ store });
      registry.set(identifier, store);
    }

    return store;
  },

  _storeWillDestroy(store) {
    let identifier = store.get('_adapter.identifier');
    this._stores.remove(identifier);
  },

  willDestroy() {
    this._stores.destroy();
    this._super();
  }

});
