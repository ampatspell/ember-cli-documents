import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import BaseModelMixin from './-model-mixin';

export const ModelMixin = Mixin.create({

  _storeIdentifier: reads('store.identifier'),
  _databaseIdentifier: reads('database.identifier'),

  _debug: computed('_storeIdentifier', '_databaseIdentifier', function() {
    let {
      _storeIdentifier: store,
      _databaseIdentifier: database
    } = this.getProperties('_storeIdentifier', '_databaseIdentifier');

    return {
      store,
      database
    };
  }),

});

export const reopenModel = Model => Model.reopenClass({
  debugColumns: [ '_debug' ]
});

export default reopenModel(EmberObject.extend(BaseModelMixin, ModelMixin));
