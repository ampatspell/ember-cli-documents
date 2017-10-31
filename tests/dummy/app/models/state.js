import Ember from 'ember';
import { Model } from 'documents';
import StateRestore from './state/-restore';
import StateSetup from './state/-setup';

const {
  computed: { readOnly }
} = Ember;

export default Model.extend(
  StateRestore,
  StateSetup, {

  database: readOnly('store.db.main'),
  session: readOnly('store.session')

});
