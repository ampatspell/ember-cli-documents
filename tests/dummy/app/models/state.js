import { Model } from 'documents';
import StateRestore from './state/-restore';
import StateSetup from './state/-setup';
import { readOnly } from '@ember/object/computed';

export default Model.extend(
  StateRestore,
  StateSetup, {

  database: readOnly('store.db.main'),
  session: readOnly('store.session')

});
