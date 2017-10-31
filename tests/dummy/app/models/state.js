import Ember from 'ember';
import { Model } from 'documents';
import StateRestore from './state/-restore';
import StateSetup from './state/-setup';

const {
  RSVP: { all },
  computed: { readOnly }
} = Ember;

export default Model.extend(
  StateRestore,
  StateSetup, {

  database: readOnly('store.db.main'),
  session: readOnly('store.session'),

  async restore() {
    await all([
      this._startChanges(),
      this._restoreSession(),
      this._needsSetup()
    ]);
  }

});
