import Ember from 'ember';

export default Ember.Object.extend({

  stores: null,
  _adapter: null,

  _databaseAdapterFactory() {
    let { _adapter, stores } = this.getProperties('_adapter', 'stores');
    return stores.adapterFactory(_adapter, 'database');
  },

  createDatabaseAdapter() {
    let Adapter = this._databaseAdapterFactory();
    let adapter = this;
    return Adapter.create({ adapter });
  }

});
