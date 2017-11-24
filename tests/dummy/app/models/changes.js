import { Model } from 'documents';

export default Model.extend({

  async start() {
    let changes = this.get('database').changes({ feed: [ 'continuous', 'event-source', 'long-polling' ] });
    changes.start();
    return { ok: true };
  }

});
