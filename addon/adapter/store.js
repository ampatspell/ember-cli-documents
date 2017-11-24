import EmberObject from '@ember/object';

export default EmberObject.extend({

  stores: null,
  store: null,

  _adapter: null,

  _databaseAdapterFactory() {
    let { adapter, stores } = this.getProperties('adapter', 'stores');
    return stores.adapterFactory(adapter, 'database');
  },

  createDatabaseAdapter() {
    let Adapter = this._databaseAdapterFactory();
    let adapter = this;
    return Adapter.create({ adapter });
  }

});
