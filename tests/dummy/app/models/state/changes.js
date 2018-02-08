import EmberObject from '@ember/object';
import { database } from 'documents';

export default EmberObject.extend({

  database: database('remote', 'main'),

  feed: null,

  async start() {
    let changes = this.get('database').changes({ feed: [ 'continuous', 'event-source', 'long-polling' ] });
    this.set('feed', changes);
    changes.start();
    return { ok: true };
  }

});
