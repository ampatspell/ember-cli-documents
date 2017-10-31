import Ember from 'ember';

export default Ember.Mixin.create({

  async _startChanges() {
    let changes = this.get('database').changes({ feed: [ 'continuous', 'event-source', 'long-polling' ] });
    changes.start();
  },

  async _restoreSession() {
    await this.get('session').restore();
  }

});
