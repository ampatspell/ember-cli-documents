import { readOnly } from '@ember/object/computed';
import { Model } from 'documents';
import StateRestore from './state/-restore';
import StateSetup from './state/-setup';
import { state } from './-model';

export default Model.extend(
  StateRestore,
  StateSetup, {

  database: readOnly('store.db.main'),
  session: readOnly('store.session'),

  blog: state({ type: 'state/blog' })

});
