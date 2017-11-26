import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { Model } from 'documents';
import StateRestore from './state/-restore';
import StateSetup from './state/-setup';
import { state } from './-model';

export default Model.extend(
  StateRestore,
  StateSetup, {

  session: readOnly('store.session'),

  blog: state({ type: 'state/blog' }),

  _sessionInfo: computed('session.{isAuthenticated,name,roles}', function() {
    return this.get('session').getProperties('isAuthenticated', 'name', 'roles');
  }),

}).reopenClass({

  debugColumns: [ '_storeIdentifier', '_databaseIdentifier', '_sessionInfo' ]

});
