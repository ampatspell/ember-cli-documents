import Mixin from '@ember/object/mixin';
import { all } from 'rsvp';

export default Mixin.create({

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
      this._restoreSession(),
      this._needsSetup()
    ]);
  }

});
