import { Model } from 'documents';
import LifecycleMixin from '../-lifecycle-mixin';

export default Model.extend(LifecycleMixin, {

  async start() {
    let changes = this.get('database').changes({ feed: [ 'continuous', 'event-source', 'long-polling' ] });
    changes.start();
    return { ok: true };
  }

});
