import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from './-model-mixin';
import { property, call } from './-properties';

const store = property('store');
const database = property('database');

export default EmberObject.extend(ModelMixin, {

  store: store(),
  database: database(),

  model: call('createModel'),

  _storeIdentifier: readOnly('store._adapter.identifier'),
  _databaseIdentifier: readOnly('database.identifier'),

}).reopenClass({

  debugColumns: [ '_storeIdentifier', '_databaseIdentifier' ]

});
