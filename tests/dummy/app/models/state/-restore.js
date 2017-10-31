import Ember from 'ember';
import { DocumentsError } from 'documents';

const {
  RSVP: { all }
} = Ember;

export default Ember.Mixin.create({

  async _startChanges() {
    let changes = this.get('database').changes({ feed: [ 'continuous', 'event-source', 'long-polling' ] });
    changes.start();
  },

  async _restoreSession() {
    await this.get('session').restore();
  },

  async restore() {
    await all([
      this._startChanges(),
      this._restoreSession()
    ]);
    throw new DocumentsError({ error: 'restore', reason: 'needs_setup' });
  }

});
