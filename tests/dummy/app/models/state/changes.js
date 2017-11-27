import { Model } from 'documents';
import LifecycleMixin from '../-lifecycle-mixin';

export default Model.extend(LifecycleMixin, {

  feed: null,

  async start() {
    let changes = this.get('database').changes({ feed: [ 'continuous', 'event-source', 'long-polling' ] });
    this.set('feed', changes);
    changes.start();
    return { ok: true };
  }

});
