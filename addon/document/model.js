import EmberObject from '@ember/object';
import Mixin from '@ember/object/mixin';
import { readOnly } from '@ember/object/computed';
import BaseModelMixin from './-model-mixin';
import { property, call } from './-properties';

const store = property('store');
const database = property('database');

export const ModelMixin = Mixin.create({

  store: store(),
  database: database(),

  _storeIdentifier: readOnly('store.identifier'),
  _databaseIdentifier: readOnly('database.identifier'),

});

export const reopenModel = Model => Model.reopenClass({
  debugColumns: [ '_storeIdentifier', '_databaseIdentifier' ]
});

export default reopenModel(EmberObject.extend(BaseModelMixin, ModelMixin, {

  model: call('createModel')

}));
