import Route from '@ember/routing/route';
import { stores } from 'documents/properties';

export default Route.extend({

  stores: stores(),

  model(params) {
    return this.get('stores')
      .store(params.store_identifier)
      .database(params.database_identifier)
      .first({ id: params.document_id });
  },

  serialize(doc) {
    return {
      store_identifier:    doc.get('database.store.identifier'),
      database_identifier: doc.get('database.identifier'),
      document_id:         doc.get('id')
    };
  }

});
